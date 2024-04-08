import axios from 'haxios';

export default {
  fetchProducts({ commit }, params) {
    commit('setLoading', true);

    return axios.get(`/products${params ? `/category/${params}` : ''}`)
      .then(({ data }) => {
        commit('setProducts', data.products);
        commit('setLoading', false);
      })
  },
  fetchCategories({ commit }) {
    return axios.get('/products/categories')
      .then(({ data }) => {
        const categories = data.map((category) => {
          return {
            name: category.charAt(0).toUpperCase() + category.slice(1),
            value: category
          }
        })
        commit('setCategories', categories);
      })
  }
}

