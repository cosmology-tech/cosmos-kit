import { NameServiceName, Mutable, NameService } from '@cosmos-kit/core';

declare const useNameService: (name?: NameServiceName) => Mutable<NameService>;

export { useNameService };
