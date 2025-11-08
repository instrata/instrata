import { createRouter, createWebHashHistory } from "vue-router";
import { routes, handleHotUpdate } from "vue-router/auto-routes";


export const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

router.beforeEach(async (to, from, next) => {
    if (from.path !== to.path) {
        window.scrollTo({ top: 0, behavior: "instant" });
    }

    return next();
})

if (import.meta.hot) {
    handleHotUpdate(router);
}
