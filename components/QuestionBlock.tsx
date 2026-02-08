// src/components/QuestionBlock.tsx
type Props = {
  label: string;
  title: string;
  description: string;
  highlight?: string;
};

export const QuestionBlock = ({
  label,
  title,
  description,
  highlight,
}: Props) => {
  return (
    <div className="bg-[#FFF9EF] p-6 rounded-xl space-y-4">
      <span className="inline-block bg-red-500 text-white text-sm px-3 py-1 rounded-full">
        {label}
      </span>
      <h3 className="text-xl font-bold">{title}</h3>
      <p>{description}</p>
      {highlight && (
        <p className="bg-[#FFB547] font-bold p-3 rounded-lg text-center">
          {highlight}
        </p>
      )}
    </div>
  );
};
