import type { LayoutMetrics } from "./layout";
import { CheckboxFactory, SlideFactory } from "./dom-factories";
import { SlidesType } from "./slides";
import { Translate, TranslateType } from "./translate";
import { AxisType } from "./axis";

export class Presenter {
  private readonly root: HTMLElement;

  private readonly document: Document;

  private readonly fragment: DocumentFragment;

  private readonly slideFactory: SlideFactory;

  private readonly checkboxFactory: CheckboxFactory;

  private readonly _slides: HTMLElement[] = [];

  private readonly translate: TranslateType;

  private layoutMetrics: LayoutMetrics;

  constructor(ownerDocument: Document, root: HTMLElement, axis: AxisType, metrics: LayoutMetrics) {
    this.root = root;
    this.document = ownerDocument;
    this.fragment = ownerDocument.createDocumentFragment();
    this.layoutMetrics = metrics;
    this.translate = Translate(axis);

    this.slideFactory = new SlideFactory(this.document);
    this.checkboxFactory = new CheckboxFactory(this.document);
  }

  public syncSlidesOffset(slides: SlidesType): void {
    const translateOffset = this.layoutMetrics.contentHeight - this.layoutMetrics.containerGap;

    for (let i = 0; i < this._slides.length; i += 1) {
      this.translate.to(this._slides[i], slides[i].viewportOffset * translateOffset);
    }
  }

  /**
   * Initializes empty (ghost) slides in the DOM.
   */
  public initializePlaceholders(): void {
    const { totalSlides } = this.layoutMetrics;
    this.destroyAllSlides();

    for (const slide of this.slideFactory.batch(totalSlides)) {
      this._slides.push(slide);
      this.root.appendChild(slide);
    }
  }

  /**
   * Populates a slide with pre-generated checkbox content.
   */
  public populateSlide(index: number): void {
    const target = this._slides[index];
    const fragment = this.fragment;

    if (!this.fragment.hasChildNodes()) {
      this.populateFragmentCache();
    }

    target.children[0].replaceChildren(fragment.cloneNode(true));
  }

  /**
   * Synchronizes a slide with the expected filled/empty state.
   */
  public syncSlide(index: number): void {
    const {} = this.layoutMetrics;
    const target = this._slides[index];

    if (!target) {
      return;
    }
  }

  /**
   * Empties a slide, reverting it back to a placeholder.
   */
  public emptySlide(index: number): void {
    const target = this._slides[index];
    target.children[0]?.replaceChildren();
  }

  /**
   * Destroys all slides, cleaning up DOM and memory.
   */
  public destroyAllSlides(): void {
    this.root.replaceChildren();
    this._slides.length = 0;
  }

  /**
   * Lazily populates the internal fragment with checkbox elements,
   * arranged in a grid based on the layout metrics.
   */
  private populateFragmentCache(): void {
    const { columns, rows, checkboxSize, gridGap } = this.layoutMetrics;

    const cellSize = checkboxSize + gridGap;
    const fragment = this.fragment;

    for (let x = 0, y = 0, row = 0; row < rows; x = 0, y += cellSize, row += 1) {
      for (let col = 0; col < columns; col += 1, x += cellSize) {
        fragment.appendChild(this.checkboxFactory.create(x, y));
      }
    }
  }
}
