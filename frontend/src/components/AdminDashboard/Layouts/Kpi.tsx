

type Props = {
  title: string;
  value: string;
  trend?: string;
};

export default function KPI({ title, value, trend }: Props) {
  const trendColor = trend?.startsWith("+") ? "text-green-500" : "text-red-500";
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow flex flex-col">
      <span className="text-sm text-gray-500 dark:text-gray-300">{title}</span>
      <span className="text-xl font-bold">{value}</span>
      {trend && <span className={`text-xs ${trendColor}`}>{trend}</span>}
    </div>
  );
}
