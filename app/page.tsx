import ShoeViewer from '@/components/ShoeViewer';

export default function Home() {
  return (
    <main className="relative">
      <ShoeViewer />

      {/* Content sections to enable scrolling */}

      <section className="relative z-20 h-screen bg-muted/20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Interactive Experience</h2>
          <p className="text-muted-foreground">
            The brain rotates as you scroll through the page
          </p>
        </div>
      </section>

      <section className="relative z-20 h-screen bg-muted/20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Keep Scrolling</h2>
          <p className="text-muted-foreground">
            Watch the brain continue to rotate
          </p>
        </div>
      </section>
    </main>
  );
}
