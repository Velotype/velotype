// deno-lint-ignore-file no-explicit-any

import type {ChildrenAttr, Component, FunctionComponent} from "../tsx/tsx-core.ts"

import type {AnchorHTMLAttributes, HTMLAttributes, AreaHTMLAttributes, ArticleHTMLAttributes, AsideHTMLAttributes, AudioHTMLAttributes, BaseHTMLAttributes, BlockquoteHTMLAttributes, BrHTMLAttributes, ButtonHTMLAttributes, CanvasHTMLAttributes, CaptionHTMLAttributes, ColHTMLAttributes, ColgroupHTMLAttributes, DataHTMLAttributes, DataListHTMLAttributes, DdHTMLAttributes, DelHTMLAttributes, DetailsHTMLAttributes, DialogHTMLAttributes, DlHTMLAttributes, DtHTMLAttributes, EmbedHTMLAttributes, FieldsetHTMLAttributes, FigcaptionHTMLAttributes, FooterHTMLAttributes, FormHTMLAttributes, HeadingHTMLAttributes, HeadHTMLAttributes, HeaderHTMLAttributes, HrHTMLAttributes, HtmlHTMLAttributes, IframeHTMLAttributes, ImgHTMLAttributes, InputHTMLAttributes, InsHTMLAttributes, LabelHTMLAttributes, LegendHTMLAttributes, LiHTMLAttributes, LinkHTMLAttributes, MainHTMLAttributes, MapHTMLAttributes, MenuHTMLAttributes, MetaHTMLAttributes, MeterHTMLAttributes, NavHTMLAttributes, NoScriptHTMLAttributes, ObjectHTMLAttributes, OlHTMLAttributes, OptgroupHTMLAttributes, OptionHTMLAttributes, OutputHTMLAttributes, PictureHTMLAttributes, ProgressHTMLAttributes, QuoteHTMLAttributes, ScriptHTMLAttributes, SearchHTMLAttributes, SelectHTMLAttributes, SlotHTMLAttributes, SourceHTMLAttributes, StyleHTMLAttributes, TableHTMLAttributes, TdHTMLAttributes, TemplateHTMLAttributes, TextareaHTMLAttributes, ThHTMLAttributes, TimeHTMLAttributes, TitleHTMLAttributes, TrackHTMLAttributes, UlHTMLAttributes, VideoHTMLAttributes, WbrHTMLAttributes } from "./dom-types.d.ts"

/**
 * The JSX namespace includes a baseline of HTML types for validating HTML tags and their
 * accepted attributes
 */
export namespace JSXInternal {

    /** Types that are allowed as a `<tag/>` */
    export type ElementType<C extends Component<any,any>> = keyof IntrinsicElements
        | FunctionComponent<any>
        | C

    /**
     * JSX Return type (the type returned by `createElement()` )
     * 
     * Note: This is far from optimal, ideally there would be a way of specifying the return type per \<tag/>
     */
    export type Element = any

    /**
     * IntrinsicElements defines the set of allowed
     * string tags and maps their Attributes' types
     * \<tag {attrs}/>
     */
    export interface IntrinsicElements {
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/a */
        a: AnchorHTMLAttributes<HTMLAnchorElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/abbr */
        abbr: HTMLAttributes<HTMLElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/address */
        address: HTMLAttributes<HTMLElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/area */
        area: AreaHTMLAttributes<HTMLAreaElement> // void element (no children allowed)
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/article */
        article: ArticleHTMLAttributes<HTMLElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/aside */
        aside: AsideHTMLAttributes<HTMLElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/audio */
        audio: AudioHTMLAttributes<HTMLAudioElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/b */
        b: HTMLAttributes<HTMLElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/base */
        base: BaseHTMLAttributes<HTMLBaseElement> // void element (no children allowed)
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/bdi */
        bdi: HTMLAttributes<HTMLElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/bdo */
        bdo: HTMLAttributes<HTMLElement> & ChildrenAttr
        // big is deprecated
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/blockquote */
        blockquote: BlockquoteHTMLAttributes<HTMLQuoteElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/body */
        body: HTMLAttributes<HTMLBodyElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/br */
        br: BrHTMLAttributes<HTMLBRElement> // void element (no children allowed)
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/button */
        button: ButtonHTMLAttributes<HTMLButtonElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/canvas */
        canvas: CanvasHTMLAttributes<HTMLCanvasElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/caption */
        caption: CaptionHTMLAttributes<HTMLTableCaptionElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/cite */
        cite: HTMLAttributes<HTMLElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/code */
        code: HTMLAttributes<HTMLElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/col */
        col: ColHTMLAttributes<HTMLTableColElement> // void element (no children allowed)
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/colgroup */
        colgroup: ColgroupHTMLAttributes<HTMLTableColElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/data */
        data: DataHTMLAttributes<HTMLDataElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/datalist */
        datalist: DataListHTMLAttributes<HTMLDataListElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dd */
        dd: DdHTMLAttributes<HTMLElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/del */
        del: DelHTMLAttributes<HTMLModElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/details */
        details: DetailsHTMLAttributes<HTMLDetailsElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dfn */
        dfn: HTMLAttributes<HTMLElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog */
        dialog: DialogHTMLAttributes<HTMLDialogElement> & ChildrenAttr
        // dir is deprecated
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div */
        div: HTMLAttributes<HTMLDivElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dl */
        dl: DlHTMLAttributes<HTMLDListElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dt */
        dt: DtHTMLAttributes<HTMLElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/em */
        em: HTMLAttributes<HTMLElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/embed */
        embed: EmbedHTMLAttributes<HTMLEmbedElement> // void element (no children allowed)
        // fencedframe has limited availability - TODO, implement: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/fencedframe
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/fieldset */
        fieldset: FieldsetHTMLAttributes<HTMLFieldSetElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/figcaption */
        figcaption: FigcaptionHTMLAttributes<HTMLElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/figure */
        figure: HTMLAttributes<HTMLElement> & ChildrenAttr
        // font is deprecated
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/footer */
        footer: FooterHTMLAttributes<HTMLElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/form */
        form: FormHTMLAttributes<HTMLFormElement> & ChildrenAttr
        // frame is deprecated
        // frameset is deprecated
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/Heading_Elements */
        h1: HeadingHTMLAttributes<HTMLHeadingElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/Heading_Elements */
        h2: HeadingHTMLAttributes<HTMLHeadingElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/Heading_Elements */
        h3: HeadingHTMLAttributes<HTMLHeadingElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/Heading_Elements */
        h4: HeadingHTMLAttributes<HTMLHeadingElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/Heading_Elements */
        h5: HeadingHTMLAttributes<HTMLHeadingElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/Heading_Elements */
        h6: HeadingHTMLAttributes<HTMLHeadingElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/head */
        head: HeadHTMLAttributes<HTMLHeadElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/header */
        header: HeaderHTMLAttributes<HTMLElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/hgroup */
        hgroup: HTMLAttributes<HTMLElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/hr */
        hr: HrHTMLAttributes<HTMLHRElement> // void element (no children allowed)
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/html */
        html: HtmlHTMLAttributes<HTMLHtmlElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/i */
        i: HTMLAttributes<HTMLElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/iframe */
        iframe: IframeHTMLAttributes<HTMLIFrameElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/img */
        img: ImgHTMLAttributes<HTMLImageElement> // void element (no children allowed)
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input */
        input: InputHTMLAttributes<HTMLInputElement> // void element (no children allowed)
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/ins */
        ins: InsHTMLAttributes<HTMLModElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/kbd */
        kbd: HTMLAttributes<HTMLElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/label */
        label: LabelHTMLAttributes<HTMLLabelElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/legend */
        legend: LegendHTMLAttributes<HTMLLegendElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/li */
        li: LiHTMLAttributes<HTMLLIElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/link */
        link: LinkHTMLAttributes<HTMLLinkElement> // void element (no children allowed)
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/main */
        main: MainHTMLAttributes<HTMLElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/map */
        map: MapHTMLAttributes<HTMLMapElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/mark */
        mark: HTMLAttributes<HTMLElement> & ChildrenAttr
        // marquee is deprecated
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/menu */
        menu: MenuHTMLAttributes<HTMLMenuElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/menuitem */
        menuitem: HTMLAttributes<HTMLUnknownElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta */
        meta: MetaHTMLAttributes<HTMLMetaElement> // void element (no children allowed)
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meter */
        meter: MeterHTMLAttributes<HTMLMeterElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/nav */
        nav: NavHTMLAttributes<HTMLElement> & ChildrenAttr
        // nobr is deprecated
        // noembed is deprecated
        // noiframe is deprecated
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/noscript */
        noscript: NoScriptHTMLAttributes<HTMLElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/object */
        object: ObjectHTMLAttributes<HTMLObjectElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/ol */
        ol: OlHTMLAttributes<HTMLOListElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/optgroup */
        optgroup: OptgroupHTMLAttributes<HTMLOptGroupElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/option */
        option: OptionHTMLAttributes<HTMLOptionElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/output */
        output: OutputHTMLAttributes<HTMLOutputElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/p */
        p: HTMLAttributes<HTMLParagraphElement> & ChildrenAttr
        // param is deprecated
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/picture */
        picture: PictureHTMLAttributes<HTMLPictureElement> & ChildrenAttr
        // plaintext is deprecated
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/pre */
        pre: HTMLAttributes<HTMLPreElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/progress */
        progress: ProgressHTMLAttributes<HTMLProgressElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/q */
        q: QuoteHTMLAttributes<HTMLQuoteElement> & ChildrenAttr
        // rp is deprecated
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/rp */
        rp: HTMLAttributes<HTMLElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/rt */
        rt: HTMLAttributes<HTMLElement> & ChildrenAttr
        // rtc is deprecated
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/ruby */
        ruby: HTMLAttributes<HTMLElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/s */
        s: HTMLAttributes<HTMLElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/samp */
        samp: HTMLAttributes<HTMLElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/script */
        script: ScriptHTMLAttributes<HTMLScriptElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/search */
        search: SearchHTMLAttributes<HTMLElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/section */
        section: HTMLAttributes<HTMLElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/select */
        select: SelectHTMLAttributes<HTMLSelectElement> & ChildrenAttr
        // selectedcontent has limited availability - TODO, implement: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/selectedcontent
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/slot */
        slot: SlotHTMLAttributes<HTMLSlotElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/small */
        small: HTMLAttributes<HTMLElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/source */
        source: SourceHTMLAttributes<HTMLSourceElement> // void element (no children allowed)
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/span */
        span: HTMLAttributes<HTMLSpanElement> & ChildrenAttr
        // strike is deprecated
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/strong */
        strong: HTMLAttributes<HTMLElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/style */
        style: StyleHTMLAttributes<HTMLStyleElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/sub */
        sub: HTMLAttributes<HTMLElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/summary */
        summary: HTMLAttributes<HTMLElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/sup */
        sup: HTMLAttributes<HTMLElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/table */
        table: TableHTMLAttributes<HTMLTableElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/tbody */
        tbody: HTMLAttributes<HTMLTableSectionElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/td */
        td: TdHTMLAttributes<HTMLTableCellElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/template */
        template: TemplateHTMLAttributes<HTMLTemplateElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/textarea */
        textarea: TextareaHTMLAttributes<HTMLTextAreaElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/tfoot */
        tfoot: HTMLAttributes<HTMLTableSectionElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/th */
        th: ThHTMLAttributes<HTMLTableCellElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/thead */
        thead: HTMLAttributes<HTMLTableSectionElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/time */
        time: TimeHTMLAttributes<HTMLTimeElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/title */
        title: TitleHTMLAttributes<HTMLTitleElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/tr */
        tr: HTMLAttributes<HTMLTableRowElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/track */
        track: TrackHTMLAttributes<HTMLTrackElement> // void element (no children allowed)
        // tt is deprecated
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/u */
        u: UlHTMLAttributes<HTMLElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/ul */
        ul: HTMLAttributes<HTMLUListElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/var */
        var: HTMLAttributes<HTMLElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/video */
        video: VideoHTMLAttributes<HTMLVideoElement> & ChildrenAttr
        /** Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/wbr */
        wbr: WbrHTMLAttributes<HTMLElement> // void element (no children allowed)
        // xmp is deprecated
    }
}
