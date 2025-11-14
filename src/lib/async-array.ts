
type Action = {
  method: (arr: unknown[], ...params: any[]) => Promise<unknown[]>
  params: unknown[]
}

export class AsyncArray<T> implements PromiseLike<T[]> {
  private readonly original: T[];
  private readonly actions: Action[];

  constructor(array: T[]) {
    this.original = array;
    this.actions = [];
  }

  map<U>(
      callback: (value: T, index: number, array: T[]) => U | Promise<U>
  ): AsyncArray<U> {
    this.actions.push({
      method: asyncMap,
      params: [callback],
    });
    return forceCast<AsyncArray<U>>(this);
  }

  mapSeries<U>(
      callback: (value: T, index: number, array: T[]) => U | Promise<U>
  ): AsyncArray<U> {
    this.actions.push({
      method: asyncMapSeries,
      params: [callback],
    });
    return forceCast<AsyncArray<U>>(this);
  }

  filter(
      predicate: (value: T, index: number, array: T[]) => boolean | Promise<boolean>
  ): AsyncArray<T> {
    this.actions.push({
      method: asyncFilter,
      params: [predicate],
    });
    return this;
  }

  flatMap<U>(
      callback: (value: T, index: number, array: T[]) => U[] | Promise<U[]>
  ): AsyncArray<U> {
    this.actions.push({
      method: asyncFlatMap,
      params: [callback],
    });
    return forceCast<AsyncArray<U>>(this);
  }

  reduce<U>(
      reducer: (acc: U, value: T, index: number, array: T[]) => U | Promise<U>,
      initial: U
  ): AsyncArray<U> {
    this.actions.push({
      method: asyncReduce,
      params: [reducer, initial],
    });
    return forceCast<AsyncArray<U>>(this);
  }

  async forEach(
      callback: (value: T, index: number, array: T[]) => void | Promise<void>
  ): Promise<void> {
    const array = await this.toArray();
    await asyncForEach(array, callback);
  }

  async some(
      predicate: (value: T, index: number, array: T[]) => boolean | Promise<boolean>
  ): Promise<boolean> {
    const array = await this.toArray();
    return await asyncSome(array, predicate);
  }

  async every(
      predicate: (value: T, index: number, array: T[]) => boolean | Promise<boolean>
  ): Promise<boolean> {
    const array = await this.toArray();
    return await asyncEvery(array, predicate);
  }

  sortBy<K>(
      selector: (value: T, index: number, array: T[]) => K | Promise<K>
  ): AsyncArray<T> {
    this.actions.push({
      method: asyncSortBy,
      params: [selector],
    });
    return this;
  }

  async toArray(): Promise<T[]> {
    let array: unknown[] = this.original;

    for (const action of this.actions) {
      array = await action.method(array, ...action.params);
    }

    return forceCast<T[]>(array);
  }

  then<TResult1 = T[], TResult2 = never>(
      resolve?: ((value: T[]) => TResult1 | PromiseLike<TResult1>) | null,
      reject?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null
  ): Promise<TResult1 | TResult2> {
    return this.toArray().then(resolve, reject);
  }
}

// ----------------------------------------

function forceCast<T>(v: unknown): T {
  return v as T;
}

export async function asyncMap<U, T>(
    array: T[],
    callback: (value: T, index: number, array: T[]) => (Promise<U> | U)
): Promise<U[]> {
  return Promise.all(array.map((v, i, a) => Promise.resolve(callback(v, i, a))));
}

export async function asyncMapSeries<U, T>(
    array: T[],
    callback: (value: T, index: number, array: T[]) => (Promise<U> | U)
): Promise<U[]> {
  const result: U[] = [];
  for (let i = 0; i < array.length; i++) {
    result.push(await Promise.resolve(callback(array[i]!, i, array)));
  }
  return result;
}

export async function asyncFilter<T>(
    array: T[],
    predicate: (value: T, index: number, array: T[]) => (Promise<boolean> | boolean)
): Promise<T[]> {
  const results = await Promise.all(
      array.map(async (v, i, a) => [v, await Promise.resolve(predicate(v, i, a))] as const)
  );
  return results.filter(([_, keep]) => keep).map(([v]) => v);
}

export async function asyncFlatMap<U, T>(
    array: T[],
    callback: (value: T, index: number, array: T[]) => (Promise<U[]> | U[]),
): Promise<U[]> {
  return (await asyncMap(array, callback)).flat();
}

export async function asyncReduce<T, U>(
    array: T[],
    reducer: (acc: U, value: T, index: number, array: T[]) => Promise<U> | U,
    initial: U
): Promise<U> {
  let acc = initial;
  for (let i = 0; i < array.length; i++) {
    acc = await Promise.resolve(reducer(acc, array[i]!, i, array));
  }
  return acc;
}

export async function asyncForEach<T>(
    array: T[],
    callback: (value: T, index: number, array: T[]) => Promise<void> | void
): Promise<void> {
  await Promise.all(
      array.map((v, i, a) => Promise.resolve(callback(v, i, a)))
  );
}

export async function asyncSome<T>(
    array: T[],
    predicate: (value: T, index: number, array: T[]) => Promise<boolean> | boolean
): Promise<boolean> {
  for (let i = 0; i < array.length; i++) {
    if (await Promise.resolve(predicate(array[i]!, i, array))) return true;
  }
  return false;
}

export async function asyncEvery<T>(
    array: T[],
    predicate: (value: T, index: number, array: T[]) => Promise<boolean> | boolean
): Promise<boolean> {
  for (let i = 0; i < array.length; i++) {
    if (!(await Promise.resolve(predicate(array[i]!, i, array)))) return false;
  }
  return true;
}

export async function asyncSortBy<T, K>(
    array: T[],
    selector: (value: T, index: number, array: T[]) => Promise<K> | K
): Promise<T[]> {
  const keys = await Promise.all(
      array.map((v, i, a) => Promise.resolve(selector(v, i, a)))
  );

  return array
      .map((v, i) => ({ v, k: keys[i]! }))
      .sort((a, b) => (a.k < b.k ? -1 : a.k > b.k ? 1 : 0))
      .map(e => e.v);
}
