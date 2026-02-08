// components/Bubble.tsx
type Props = {
  text: string;
  meta: string;
};

export const Bubble = ({ text, meta }: Props) => {
  return (
    <div className="bg-[#FFB547] rounded-xl p-4 max-w-xl mb-4">
      <p className="font-semibold">{text}</p>
      <span className="text-sm block mt-2">{meta}</span>
    </div>
  );
};
