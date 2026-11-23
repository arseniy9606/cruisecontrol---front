/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface ApiCarDTO {
  consumption_rate?: number;
  created_at?: string;
  creator?: string;
  description?: string;
  formed_at?: string;
  fuel_tank_volume?: number;
  id?: number;
  image_url?: string;
  is_owner?: number;
  liked?: number;
  likes_count?: number;
  name?: string;
  video_url?: string;
}

export interface ApiLikeRequest {
  liked?: 0 | 1;
}

export interface ApiPublicationRequest {
  consumption_rate?: number;
  description?: string;
  fuel_tank_volume?: number;
}

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "http://localhost:8086/api",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title Расход топлива: API ЛР4
 * @version 4.0
 * @baseUrl http://localhost:8086/api
 * @contact
 *
 * Автомобили, публикация, лайки. JWT + Redis blacklist.
 */
export class FuelConsumptionsApi<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  fuelConsumptions = {
    /**
     * No description
     *
     * @tags Автомобили
     * @name ListFuelConsumptions
     * @summary Список автомобилей с фильтром
     * @request GET:/fuel_consumptions
     */
    listFuelConsumptions: (
      query?: {
        /** Минимальный расход */
        consumption_min?: number;
        /** Максимальный расход */
        consumption_max?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<ApiCarDTO[], void>({
        path: `/fuel_consumptions`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Автомобили
     * @name CreateFuelConsumption
     * @summary Создать черновик с фото и видео
     * @request POST:/fuel_consumptions
     * @secure
     */
    createFuelConsumption: (
      data: {
        /** name */
        name: string;
        /** description */
        description?: string;
        /** consumption_rate */
        consumption_rate?: number;
        /** fuel_tank_volume */
        fuel_tank_volume?: number;
        /**
         * image
         * @format binary
         */
        image: File;
        /**
         * video
         * @format binary
         */
        video: File;
      },
      params: RequestParams = {},
    ) =>
      this.request<ApiCarDTO, void>({
        path: `/fuel_consumptions`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Автомобили
     * @name GetFuelConsumptionFeed
     * @summary Лента автомобилей
     * @request GET:/fuel_consumptions/feed
     */
    getFuelConsumptionFeed: (
      query?: {
        /** ID автомобиля */
        id?: number;
        /** Следующий автомобиль */
        next?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<ApiCarDTO, void>({
        path: `/fuel_consumptions/feed`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Автомобили
     * @name GetFuelConsumptionDraft
     * @summary Черновик текущего водителя
     * @request GET:/fuel_consumptions/draft
     * @secure
     */
    getFuelConsumptionDraft: (params: RequestParams = {}) =>
      this.request<ApiCarDTO, void>({
        path: `/fuel_consumptions/draft`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Автомобили
     * @name DeleteFuelConsumption
     * @summary Удалить свой автомобиль
     * @request DELETE:/fuel_consumptions/{id}
     * @secure
     */
    deleteFuelConsumption: (id: number, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/fuel_consumptions/${id}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Автомобили
     * @name PublishFuelConsumption
     * @summary Опубликовать свой черновик
     * @request PUT:/fuel_consumptions/{id}/publication
     * @secure
     */
    publishFuelConsumption: (
      id: number,
      body: ApiPublicationRequest,
      params: RequestParams = {},
    ) =>
      this.request<ApiCarDTO, void>({
        path: `/fuel_consumptions/${id}/publication`,
        method: "PUT",
        body: body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Автомобили
     * @name SetFuelConsumptionLike
     * @summary Поставить или убрать лайк
     * @request POST:/fuel_consumptions/{id}/likes
     * @secure
     */
    setFuelConsumptionLike: (
      id: number,
      body: ApiLikeRequest,
      params: RequestParams = {},
    ) =>
      this.request<ApiCarDTO, void>({
        path: `/fuel_consumptions/${id}/likes`,
        method: "POST",
        body: body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
}
