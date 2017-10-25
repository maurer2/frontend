enum Direction {
    next = 'right',
    previous = 'left',
}

class Slide {
    public constructor(public domElement: HTMLElement, private index: number) {}

    public isCurrent(activeClass = 'gallery_slide--is-current'): boolean {
        return this.domElement.classList.contains(activeClass);
    }

    public isLast(): boolean {
        const nextSibling = this.domElement.nextElementSibling as HTMLElement;

        return (nextSibling === null);
    }

    public isFirst(): boolean {
        const previousSibling = this.domElement.previousElementSibling as HTMLElement;

        return (previousSibling === null);
    }

    public getIndex(): number {
        return this.index;
    }
}

class BaseGallery {
    // private slides: Array<HTMLElement>;
    private slides: Array<Slide>;
    private linkNextSlide: HTMLLinkElement;
    private linkPreviousSlide: HTMLLinkElement;
    private counter: HTMLElement;

    public constructor(private domNode: HTMLElement) {
        const slidesList = this.domNode.querySelectorAll('.gallery_slide') as NodeListOf<HTMLElement>;
        this.slides = Array.prototype.map.call(slidesList, (element, index) => {
            return new Slide(element, index);
        });

        // this.slides = Array.prototype.slice.call(slidesList);
        // this.slides = Array.from(slidesList);
        this.linkNextSlide = this.domNode.querySelector('.gallery_next') as HTMLLinkElement;
        this.linkPreviousSlide = this.domNode.querySelector('.gallery_prev') as HTMLLinkElement;
        this.counter = this.domNode.querySelector('.gallery_counter') as HTMLElement;

        this.updateCounter();
        this.registerEvents();
    }

    private registerEvents(): void {
        this.linkNextSlide.addEventListener('click', (event: Event) => this.switchSlides(Direction.next));
        this.linkPreviousSlide.addEventListener('click', (event: Event) => this.switchSlides(Direction.previous));
    }

    private switchSlides(directionNewSlide = Direction.next): void {
        const activeSlide: Slide = this.slides.find((slide) => {
            return slide.isCurrent();
        });
        let newSlide: Slide = this.slides[activeSlide.getIndex() + 1];
        let directionCurrentSlide = Direction.previous;

        if (directionNewSlide === Direction.previous) {
            newSlide = this.slides[activeSlide.getIndex() - 1];
            directionCurrentSlide = Direction.next;
        }

        if (newSlide === undefined) {
            return;
        }

        // step 1
        newSlide.domElement.classList.add(
            'gallery_slide--is-following', `gallery_slide--is-out-of-${directionNewSlide}-bound`);

        // Force reflow to stop browsers combining step 1 and step 2
        this.domNode.getBoundingClientRect();

        // step 2
        activeSlide.domElement.classList.add(`gallery_slide--is-out-of-${directionCurrentSlide}-bound`);
        newSlide.domElement.classList.remove(`gallery_slide--is-out-of-${directionNewSlide}-bound`);

        // step 3
        activeSlide.domElement.parentElement.addEventListener('transitionend', (event: TransitionEvent) => {
            const transitionProperty = event.propertyName;
            const transitionSource = event.srcElement as HTMLElement;

            // ignore other event types and transtion-events from within each slide
            // if (transitionProperty !== 'transform' && this.slides.indexOf(transitionSource) === -1) {
            //    return;
            // }

            newSlide.domElement.classList.add('gallery_slide--is-current');
            newSlide.domElement.classList.remove('gallery_slide--is-following');
            activeSlide.domElement.classList.remove('gallery_slide--is-current');
            activeSlide.domElement.classList.remove(`gallery_slide--is-out-of-${directionCurrentSlide}-bound`);

            // step 4
            this.updateCounter();
        });
    }

    private updateCounter(): void {
        /*
        const currentSlideIndex: number = this.slides.findIndex((element: HTMLElement) => {
            return element.classList.contains('gallery_slide--is-current');
        });
        this.counter.innerHTML = `
            <span class="gallery_counter-current">${currentSlideIndex + 1}</span>
                <span class="gallery_counter-seperator">/</span>
            <span class="gallery_counter-total">${this.slides.length}</span>
        `;
        */
    }
}

const galleryBase = new BaseGallery(document.querySelector('.gallery--base') as HTMLElement);
