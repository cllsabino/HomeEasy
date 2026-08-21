import { EnvironmentInjector, runInInjectionContext } from '@angular/core';

type FirebaseContextInstance = {
  firebaseEnvironmentInjector: EnvironmentInjector;
};

export function RunInFirebaseInjectionContext(target: Function): void {
  const methodNames = Object.getOwnPropertyNames(target.prototype);

  methodNames.forEach(methodName => {
    if (methodName === 'constructor') {
      return;
    }

    const descriptor = Object.getOwnPropertyDescriptor(target.prototype, methodName);
    const originalMethod = descriptor && descriptor.value;
    if (!descriptor || typeof originalMethod !== 'function') {
      return;
    }

    descriptor.value = function (...args: unknown[]) {
      const instance = this as FirebaseContextInstance;
      return runInInjectionContext(
        instance.firebaseEnvironmentInjector,
        () => originalMethod.apply(this, args)
      );
    };
    Object.defineProperty(target.prototype, methodName, descriptor);
  });
}
