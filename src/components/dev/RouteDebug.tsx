import { useLocation, useParams } from 'react-router-dom';
import { resolveLang } from '@/lib/i18n/localePath';

export default function RouteDebug() {
  const { pathname, search } = useLocation();
  const params = useParams();
  const lang = resolveLang();
  const debug = search.includes('debug=1') || localStorage.getItem('aqlhr.debug') === '1';
  if (!debug) return null;
  return (
    <div style={{position:'fixed',bottom:8,right:8,background:'rgba(0,0,0,.7)',color:'#fff',padding:'8px 10px',borderRadius:6,zIndex:99999,fontSize:12}}>
      <div><b>path</b> {pathname}{search}</div>
      <div><b>lang</b> {lang}</div>
      <div><b>params</b> {JSON.stringify(params)}</div>
    </div>
  );
}