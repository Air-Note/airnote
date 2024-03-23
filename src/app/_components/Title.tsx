export default function Title({ children, className }: React.ComponentProps<'div'>) {
  return (
    <div className={`text-2xl text-purple font-bold md:text-3xl ${className}`}>{ children }</div>
  );
}