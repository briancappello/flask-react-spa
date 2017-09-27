/**
 * Saga injection mode constants
 *
 * RESTART_ON_REMOUNT: The default saga mode (sagas injected by a component
 * are registered with the app while that component is mounted). When the
 * component unmounts, if any of its sagas are still running, cancel them.
 *
 * ONCE_TILL_UNMOUNT: Once the component mounts and unmounts once, if it mounts
 * again, its sagas will not be registered with the app again
 *
 * DAEMON: Do not cancel or unregister sagas when the component that injected
 * them gets unmounted
 */

export const RESTART_ON_REMOUNT = '@@saga-injector/restart-on-remount'
export const ONCE_TILL_UNMOUNT = '@@saga-injector/once-till-unmount'
export const DAEMON = '@@saga-injector/daemon'
