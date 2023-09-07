
export const Footer = () => {
  return (
    <footer className="py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <p className="px-0 sm:px-4 text-center text-xs leading-loose text-muted-foreground md:text-left">
          {/* Built by dw_ for personal non-commercial use only. Venue data provided by Sportlabs. Weather data provided by Tomorrow. Location data provided by Google. */}
          Curated with dedication by dw_ for personal, non-commercial delight. Venue intelligence courtesy of Sportlabs. Tomorrow's weather forecast courtesy of Tomorrow. Location wizardry powered by the magic of Google.
        </p>
      </div>
    </footer>
  );
}