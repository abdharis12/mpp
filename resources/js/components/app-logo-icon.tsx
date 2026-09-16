import type { ImgHTMLAttributes } from 'react';

export default function AppLogoIcon(
    props: ImgHTMLAttributes<HTMLImageElement>,
) {
    return (
        <img
            src="/img/logo-mpp.png"
            alt="Mal Pelayanan Publik Kabupaten Muara Enim"
            {...props}
        />
    );
}
