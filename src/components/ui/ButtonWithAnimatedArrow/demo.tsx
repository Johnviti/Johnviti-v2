import ButtonWithAnimatedArrow from './index';

export const ButtonWithAnimatedArrowDemo = () => {
  return (
    <div className="flex flex-col gap-8 p-8">
      <div>
        <h2 className="mb-4 text-2xl font-bold text-ink">Botão com Seta Animada</h2>

        <div className="flex gap-4 flex-wrap">
          <ButtonWithAnimatedArrow variant="primary">
            Vamos Trabalhar Juntos
          </ButtonWithAnimatedArrow>

          <ButtonWithAnimatedArrow variant="secondary">
            Explorar Projetos
          </ButtonWithAnimatedArrow>

          <ButtonWithAnimatedArrow variant="primary">
            Começar Agora
          </ButtonWithAnimatedArrow>
        </div>

        <p className="mt-6 text-sm text-stone-soft">
          Passe o mouse sobre os botões para ver a seta animada se mover.
        </p>
      </div>
    </div>
  );
};
