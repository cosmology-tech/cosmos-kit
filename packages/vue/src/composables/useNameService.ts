import {
  getNameServiceRegistryFromName,
  Mutable,
  NameService,
  NameServiceName,
  State,
} from "@cosmos-kit/core";
import { ref, computed, watchEffect, reactive, watch } from "vue";
import { useManager } from "./useManager";

export const useNameService = (name?: NameServiceName) => {
  const serviceState = reactive({
    state: State.Pending as State,
    ns: null as NameService | null,
    msg: null as string | null,
  });

  const { defaultNameService, getNameService } = useManager();
  const registry = computed(() =>
    getNameServiceRegistryFromName(name || defaultNameService)
  );

  if (!registry.value) {
    throw new Error("No such name service: " + (name || defaultNameService));
  }

  watch(
    () => name,
    () => {
      serviceState.state = State.Pending;

      getNameService()
        .then((nameService) => {
          serviceState.ns = nameService;
          serviceState.state = State.Done;
        })
        .catch((e) => {
          serviceState.msg = (e as Error).message;
          serviceState.state = State.Error;
        })
        .finally(() => {
          if (serviceState.state === State.Pending) {
            serviceState.state = State.Init;
          }
        });
    },
    { immediate: true }
  );

  return serviceState;
};
