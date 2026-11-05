/** Mascote da direita, em animação contínua de corrida. */
export function HeroRunner() {
  return (
    <div className="relative flex w-fit items-end justify-center pb-1">
      <img
        src="/hero/mascote-direita.webp"
        alt=""
        width={629}
        height={760}
        className="hero-runner relative h-44 w-auto panel:h-[17rem]"
      />
    </div>
  );
}
