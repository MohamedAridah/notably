type Props = {
  children: React.ReactNode;
  title?: string;
  description?: string;
  action?: React.ReactNode;
};

const Panel = ({ children, title, description, action }: Props) => {
  return (
    <div className="rounded-lg border px-7 lg:px-10 py-5 mb-7">
      {title && (
        <div className="flex justify-between items-center border-b  pb-3 mb-5">
          <div>
            <h2 className=" capitalize font-semibold">{title}</h2>
            {description && <p className="text-muted">{description}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </div>
  );
};

export default Panel;
