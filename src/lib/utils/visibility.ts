/**
 * Visibility utilities for AqlHR - ensures proper contrast in all modes
 * Replaces hardcoded colors with semantic tokens
 */

export const getTextColorClass = (isColored: boolean, variant: 'default' | 'muted' | 'subtle' = 'default') => {
  if (isColored) {
    return 'text-primary-foreground';
  }
  
  switch (variant) {
    case 'muted':
      return 'text-muted-foreground';
    case 'subtle':
      return 'text-foreground-subtle';
    default:
      return 'text-foreground';
  }
};

export const getBackgroundColorClass = (variant: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' = 'default') => {
  switch (variant) {
    case 'primary':
      return 'bg-brand-primary text-primary-foreground';
    case 'secondary':
      return 'bg-brand-secondary text-primary-foreground';
    case 'success':
      return 'bg-status-success text-primary-foreground';
    case 'warning':
      return 'bg-status-warning text-primary-foreground';
    case 'danger':
      return 'bg-status-danger text-primary-foreground';
    default:
      return 'bg-card text-card-foreground';
  }
};

export const getBadgeColorClass = (variant: 'default' | 'blue' | 'green' | 'yellow' | 'red' | 'purple' = 'default') => {
  switch (variant) {
    case 'blue':
      return 'bg-brand-primary text-primary-foreground';
    case 'green':
      return 'bg-brand-success text-primary-foreground';
    case 'yellow':
      return 'bg-brand-warning text-primary-foreground';
    case 'red':
      return 'bg-brand-danger text-primary-foreground';
    case 'purple':
      return 'bg-brand-accent text-primary-foreground';
    default:
      return 'bg-muted text-muted-foreground';
  }
};