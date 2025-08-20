-- CCI Migration Fix: Add wave_id to responses, tighten uniques, and ensure RLS function
-- 1) Ensure RLS helper exists (adjust table/column names to your real profile schema)
create or replace function public.get_user_company_id() 
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select company_id from public.profiles where user_id = auth.uid() limit 1;
$$;

-- 2) Add wave_id to responses and enforce integrity
alter table public.cci_responses add column if not exists wave_id uuid;
alter table public.cci_responses
  add constraint cci_responses_wave_fk
  foreign key (wave_id) references public.cci_waves(id) on delete restrict;

-- 3) Auto-assign wave_id to the "active" wave of the survey if not provided
create or replace function public.cci_responses_assign_wave()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare v_wave uuid;
begin
  if new.wave_id is null then
    select w.id into v_wave
    from public.cci_waves w
    where w.survey_id = new.survey_id
    order by w.wave_no desc nulls last
    limit 1;
    new.wave_id := v_wave;
  end if;
  return new;
end;
$$;

drop trigger if exists cci_responses_assign_wave_trg on public.cci_responses;
create trigger cci_responses_assign_wave_trg
  before insert on public.cci_responses
  for each row
  execute function public.cci_responses_assign_wave();

-- 4) Guard against duplicate score rows
alter table public.cci_scores
  add constraint cci_scores_unique unique (survey_id, wave_id, scope, scope_id);

-- 5) Speed up anonymity view joins
create index if not exists idx_cci_surveys_id on public.cci_surveys(id);
create index if not exists idx_cci_scores_wave on public.cci_scores(wave_id);