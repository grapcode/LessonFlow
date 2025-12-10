import { Link } from 'react-router';

const Button = ({
  label,
  onClick,
  disabled,
  outline,
  small,
  icon: Icon,
  href, // 🔥 নতুন: link support
  className = '', // 🔥 নতুন: extra className support
}) => {
  const classes = `
    btn
    ${small ? 'btn-xs' : 'btn-sm'}
    ${outline ? 'btn-outline btn-primary' : 'btn-primary'}
    rounded-md
    w-full
    flex items-center justify-center gap-2
    text-white
    my-1 mx-1
     ${className} 
  `;

  // যদি href থাকে → Link হবে
  if (href) {
    return (
      <Link to={href} className={classes}>
        {Icon && <Icon size={18} />}
        {label}
      </Link>
    );
  }

  // না থাকলে → সাধারণ button
  return (
    <button disabled={disabled} onClick={onClick} className={classes}>
      {Icon && <Icon size={18} />}
      {label}
    </button>
  );
};

export default Button;
