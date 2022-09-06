export function getRoutePath(chainName: string, routeType?: string) {
    return (
        routeType
            ? `/${routeType}/${chainName}`
            : `/${chainName}`
    );
}

export * from './pretty';
export * from './status';