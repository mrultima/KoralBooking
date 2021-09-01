import * as LocalForage from "localforage";
import * as moment from "moment";
export interface LocalCacheTimeOptions {
  time: number;
  unit?: moment.DurationInputArg2;
}
export interface LocalCacheTimeout {
  timeout?: LocalCacheTimeOptions;
}
export interface LocalCacheOptions extends LocalCacheTimeout {
  driver?: "indexeddb" | "localstorage";
  name?: string;
  disable?: boolean;
  tenant?: string | number;
  onClear?: () => Promise<void>;
  onDelete?: (id: string) => void;
  freeze?: boolean;
}
export interface LocalCacheModel {
  added: number;
  expire: number;
  data: any;
  tenant: string | number;
  merged: Array<string>;
}
export class LocalCache {
  constructor(public options: LocalCacheOptions = {}) {
    this.instance = LocalForage.createInstance({
      name: options.name || "LocalCache",
      driver:
        options?.driver === "localstorage"
          ? LocalForage.LOCALSTORAGE
          : [
            LocalForage.WEBSQL,
            LocalForage.INDEXEDDB,
            LocalForage.LOCALSTORAGE,
          ],
    });
    LocalCache.instances.delete(
      Array.from(LocalCache.instances).find(
        (x) => x.instance.config()?.name === this.instance.config()?.name
      )
    );
    if (!LocalCache.instances.has(this)) {
      LocalCache.instances.add(this);
    }
  }
  static instances = new Set<LocalCache>();

  private instance: LocalForage;

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static async clearAll(
    {
      resetDate = null,
      tenant = null,
      apply = null,
      force = null,
      trigger = null
    }: {
      resetDate?: moment.MomentInput;
      tenant?: number | string;
      apply?: string[] | string;
      force?: boolean;
      trigger?: boolean;
    } = {
        resetDate: null,
        tenant: null,
        apply: null,
        force: null,
        trigger: null
      }
  ) {
    const list = Array.from(LocalCache.instances);
    for (let i = 0; i < list.length; i++) {
      const $this = list[i], configName = $this.instance.config()?.name;
      if (apply && (Array.isArray(apply) ? apply : [apply]).indexOf(configName) === -1) {
        continue;
      }
      if (force) {
        await $this.clear(trigger);
      } else if (resetDate) {
        await $this.instance.iterate<LocalCacheModel, any>(
          async (value, key) => {
            if (tenant && value.tenant && value.tenant !== tenant) {
              return;
            }
            if (
              value.expire > 0 &&
              value.added < moment(resetDate).unix()
            ) {
              await $this.removeItem(key, trigger);
            }
          }
        );
      } else {
        if ($this.options.freeze !== true) {
          await $this.clear(trigger);
        }
      }
    }
  }

  async getItem<T>(
    key: string,
    {
      callback = null,
      defaultValue = null,
      expire = null,
      merge = null,
      fullResponse = null
    }: {
      callback?: (cacheData: T) => boolean;
      defaultValue?: any;
      expire?: moment.MomentInput;
      merge?: string;
      fullResponse?: boolean;
    } = {
        callback: null,
        defaultValue: null,
        expire: null,
        merge: null,
        fullResponse: null
      }
  ): Promise<T | null> {
    if (this.options.disable === true) {
      return null;
    }
    let cacheData = await this.instance.getItem<LocalCacheModel>(key);
    if (cacheData && merge && cacheData.merged.indexOf(merge) === -1) {
      cacheData = null;
    }
    if (!cacheData) {
      if (callback && !callback(defaultValue)) {
        return null;
      }
      return defaultValue;
    }
    if (
      (expire && moment(expire).unix() > cacheData.added) ||
      (cacheData.expire > 0 && cacheData.expire < moment().unix())
    ) {
      if (callback && !callback(defaultValue)) {
        return null;
      }
      return defaultValue;
    }
    if (callback && !callback(cacheData.data)) {
      return null;
    }
    return fullResponse ? cacheData : cacheData.data;
  }

  async setItem(
    key: string,
    value:
      | Array<any>
      | ArrayBuffer
      | Blob
      | Float32Array
      | Float64Array
      | Int8Array
      | Int16Array
      | Int32Array
      | Number
      | Object
      | Uint8Array
      | Uint8ClampedArray
      | Uint16Array
      | Uint32Array
      | String,
    {
      timeout = null,
      merge = null
    }: {
      timeout?: LocalCacheTimeOptions,
      merge?: string
    } = {
        timeout: null,
        merge: null
      }
  ) {
    if (this.options.disable === true) {
      return null;
    }
    const t = timeout || this.options.timeout;
    let expire = -1;
    if (t) {
      expire = moment()
        .add(t.time, t.unit || "seconds")
        .unix();
    }
    let mergeKeys: string[] = [];
    if (merge) {
      mergeKeys = [merge];
      const item = await this.instance.getItem<LocalCacheModel>(key);
      if (item && Array.isArray(item.merged)) {
        mergeKeys = Array.from(new Set([...item.merged, merge]));
      }
    }
    return await this.instance.setItem<LocalCacheModel>(key, {
      added: moment().unix(),
      expire,
      data: value,
      tenant: this.options.tenant,
      merged: mergeKeys
    });
  }

  async removeItem(key: string, trigger?: boolean) {
    if (!(typeof trigger === 'boolean' && trigger)) {
      await this.instance.removeItem(key);
    }
    if (this.options.onDelete) {
      this.options.onDelete(key);
    }
  }

  async clear(trigger?: boolean) {
    if (!(typeof trigger === 'boolean' && trigger)) {
      await this.instance.clear();
    }
    if (this.options.onClear) {
      await this.options.onClear();
    }
  }
}
