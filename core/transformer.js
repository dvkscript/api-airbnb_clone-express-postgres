class Transformer {
  #data = null;
  #req = null;
  constructor(resource, req = null) {
    if (typeof this.response !== "function") {
      throw new Error("Vui lòng tạo phương tên là response");
    }
    
    this.#req = req;

    if (Array.isArray(resource)) {
      this.#data = resource.map((instance) => this.response(instance));
    } else {
      this.#data = this.response(resource);
    }
    return this.#data;
  };
  getRequest() {
    return this.#req;
  }
}

module.exports = Transformer;
