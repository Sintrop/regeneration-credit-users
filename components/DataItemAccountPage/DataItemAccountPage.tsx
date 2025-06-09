interface Props {
  label: string;
  value: string | number;
}

export function DataItemAccountPage({ label, value }: Props) {
  return (
    <div className="flex items-center gap-2">
      <p className="font-bold text-black">{label}:</p>
      <p className="text-black">{value}</p>
    </div>
  );
}
