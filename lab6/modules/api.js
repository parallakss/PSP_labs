class Api {
  async get(url) {
    return this._request(url);
  }

  async post(url, data) {
    return this._request(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  }

  async patch(url, data) {
    return this._request(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  }

  async delete(url) {
    return this._request(url, {
      method: 'DELETE',
    });
  }

  async _request(url, options = {}) {
    const response = await fetch(url, options);
    const data = response.status === 204 ? null : await response.json();

    return {
      data,
      status: response.status,
      ok: response.ok,
    };
  }
}

export const api = new Api();
