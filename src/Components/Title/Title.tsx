import React from 'react'

type Props = {
    title: string;
    subtitle: string;
}

function Title({ title, subtitle }: Props) {
  return (
    <div className="w-full lg:w-6/12 xl:w-4/12 px-3">
        <div className="group relative mb-6 overflow-hidden rounded-2xl border border-primary/20 bg-surface shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl xl:mb-0">
            {/* Accent */}
            <div className="absolute left-0 top-0 h-full w-1 bg-primary transition-all duration-300 group-hover:w-2" />

            <div className="p-6">
                <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                        <h5 className="mb-2 text-xs font-semibold uppercase tracking-wider text-text/60">
                            {title}
                        </h5>

                        <span className="block truncate text-2xl font-bold tracking-tight text-text">
                            {subtitle}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}

export default Title