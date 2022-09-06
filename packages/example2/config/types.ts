export interface Nav {
    label: string;
    link: string;
    icon?: string | JSX.Element;
    isNext?: boolean; // if using Nextjs Link and Img 
}