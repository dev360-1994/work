

export class ResModel<T> {
  count?: number;
  page?: number;
  size?: number;
  message?: string;
  isSuccess?: boolean;
  data?: T;

  // error
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
  validationErrors?: Array<string>;
  constructor(obj?: any) {
    this.count = obj?.count ?? 0;
    this.page = obj?.page ?? 1;
    this.size = obj?.size ?? 10;
    this.message = obj?.message;
    this.isSuccess = obj?.isSuccess ?? false;
    this.data = obj?.data;
    this.type = obj?.type;
    this.title = obj?.title;
    this.status = obj?.status;
    this.detail = obj?.detail;
    this.instance = obj?.instance;
    this.validationErrors = obj?.validationErrors;
  }
  next() {

  }
  prev() {

  }
  first() {

  }
  last() {

  }
}