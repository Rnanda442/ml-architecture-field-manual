export function WeightHelpDrawer({
  open,
  onClose
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <aside className="drawer weight-drawer open">
      <div className="drawer-head">
        <div>
          <span className="eyebrow">Help</span>
          <h2>Three places weighting happens</h2>
        </div>
        <button className="icon-button" onClick={onClose} aria-label="Close weight help">
          x
        </button>
      </div>
      <p className="drawer-lead">Not every weight is a neural-network parameter.</p>
      <div className="weight-help-layers">
        <article className="learned">
          <b>MODEL</b>
          <p>What relationships the network learns.</p>
          <small>Purple: learned model parameter</small>
          <small>Teal: dynamic input-dependent weight</small>
        </article>
        <article className="training">
          <b>TRAINING</b>
          <p>What errors, samples, or targets matter more.</p>
          <small>Blue: data/sample weight</small>
          <small>Orange: selected training objective</small>
        </article>
        <article className="decision">
          <b>DECISION</b>
          <p>What real-world mistakes cost more.</p>
          <small>Red: operational decision cost</small>
        </article>
      </div>
    </aside>
  );
}
