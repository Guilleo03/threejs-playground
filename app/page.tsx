import ShoeViewer from '@/components/ShoeViewer';

export default function Home() {
  return (
    <main className="relative">
      <ShoeViewer />

      {/* Content sections to enable scrolling */}

      <section className="relative z-20 h-screen bg-muted/20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Stage 1: Centered</h2>
          <p className="text-muted-foreground">
            The shoe starts centered and aligned
          </p>
        </div>
      </section>

      <section className="relative z-20 h-screen bg-muted/20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Stage 2: Left Aligned</h2>
          <p className="text-muted-foreground">
            Watch the shoe move to the left
          </p>
        </div>
      </section>

      <section className="relative z-20 h-screen bg-muted/20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Stage 3: Right Aligned</h2>
          <p className="text-muted-foreground">
            Now it moves to the right side
          </p>
        </div>
      </section>

      <section className="relative z-20 h-screen bg-muted/20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Stage 4: Back to Center</h2>
          <p className="text-muted-foreground">
            Finally returns to the center position
          </p>
        </div>
      </section>
    </main>
  );
}
