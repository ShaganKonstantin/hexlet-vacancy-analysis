// import "vite/modulepreload-polyfill";
// import { createRoot } from "react-dom/client";
// import { createInertiaApp } from "@inertiajs/react";
// import { InertiaProgress } from '@inertiajs/progress';
// import axios from 'axios';
// import React from 'react';
// document.addEventListener('DOMContentLoaded', () => {

//     const csrfMeta = document.querySelector('meta[name=csrf-token]');
//     const csrfToken = csrfMeta ? csrfMeta.getAttribute('content') : '';
//     axios.defaults.headers.common['X-CSRF-Token'] = csrfToken;

//     InertiaProgress.init({ color: '#4B5563' });

//     createInertiaApp({
//         resolve: (name) => import(`./components/pages/${name}.tsx`),
//         setup({ el, App, props }: {
//             el: HTMLElement,
//             App: React.ComponentType<{ page: any }>,
//             props: any
//         }) {
//             const root = createRoot(el);
//             root.render(<App {...props} />);
//         },
//     });
// });

import { createRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/react";
import { InertiaProgress } from '@inertiajs/progress';
import axios from 'axios';
import React from 'react';

document.addEventListener('DOMContentLoaded', () => {
    const csrfMeta = document.querySelector('meta[name=csrf-token]');
    const csrfToken = csrfMeta ? csrfMeta.getAttribute('content') : '';
    axios.defaults.headers.common['X-CSRF-Token'] = csrfToken;

    InertiaProgress.init({ color: '#4B5563' });

    // createInertiaApp({
    //     resolve: (name) => import(`./components/pages/region/ui/${name}.tsx`),
    //     setup: ({ el, App, props }) => {
    //         const root = createRoot(el);
    //         root.render(React.createElement(App, props));
    //     },
    // });
createInertiaApp({
    resolve: (name) => {
        const pages = import.meta.glob('./components/pages/**/*.tsx', { eager: true });
        
        if (pages[`./components/pages/region/ui/RegionPage.tsx`]) {
            return pages[`./components/pages/region/ui/RegionPage.tsx`];
        }
        
        return pages[`./components/pages/${name}.tsx`];
    },
    setup: ({ el, App, props }) => {
        const root = createRoot(el);
        root.render(React.createElement(App, props));
    },
});
});