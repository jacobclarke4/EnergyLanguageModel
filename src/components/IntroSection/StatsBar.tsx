
const stats = [
  {
    value: '10M+',
    label: 'tariff combinations across',
    highlight: '3,000+',
    suffix: 'US utilities',
  },
  {
    value: '1B+',
    label: 'individual data points powering domain expertise',
  },
  {
    value: '500K+',
    label: 'question-answer pairs for precision training',
  },
  {
    value: '6,000+',
    label: 'unique sources across',
    highlight: '7',
    suffix: 'comprehensive tranches',
  },
];

export default function StatsBar() {
  return (
    <section className="w-full py-4 sm:py-4 md:py-6 lg:py-8 max-w-6xl mx-auto px-4">
      
      <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`
              flex flex-col gap-1 sm:gap-2 md:gap-3 lg:gap-4
              border-b border-purple-400/10 sm:border-b-0
              last:border-b-0 last:pb-0
            `}
          >
            <div className='flex gap-3'>
                <div className='bg-[var(--purple)] w-1 h-full mb-2 rounded-full'>
                </div>
                <div className="text-2xl/tight sm:text-2xl/tight md:text-2xl/tight lg:text-3xl/tight font-bold text-black tracking-tight leading-none">
                {stat.value}
                </div>
            </div>
            <div className="text-base/snug font-medium text-black/85 max-w-[220px]">
              {stat.highlight ? (
                <>
                  {stat.label} <span className="text-[var(--purple)] font-medium">{stat.highlight}</span> {stat.suffix}
                </>
              ) : (
                stat.label
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}