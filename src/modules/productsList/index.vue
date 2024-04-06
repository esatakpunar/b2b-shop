<script>
import { mapActions, mapState } from 'vuex'
import ToastMixin from '@/mixins/toast.js'

export default {
  data() {
    return {
      mockProducts: null,
      layout: 'grid',
      items: [
        {
          label: 'Price Range',
          items: [
            {
              label: '$50 - $100',
              icon: 'pi pi-dollar',
              route: '/products'
            },
            {
              label: '$100 - $150',
              icon: 'pi pi-dollar',
              route: '/products'
            },
            {
              label: '$150 - $200',
              icon: 'pi pi-dollar',
              route: '/products'
            },
            {
              label: '$200 - $250',
              icon: 'pi pi-dollar',
              route: '/products'
            }
          ]
        },
        {
          label: 'Eveolution Rate',
          items: [
            {
              label: '5 Star',
              icon: 'pi pi-star',
              route: '/products'
            },
            {
              label: '4 Star',
              icon: 'pi pi-star',
              route: '/products'
            },
            {
              label: '3 Star',
              icon: 'pi pi-star',
              route: '/products'
            },
            {
              label: '2 Star',
              icon: 'pi pi-star',
              route: '/products'
            }
          ]
        }
      ],
      categories: [
        {
          label: 'Categories',
          items: [
            {
              label: 'Electronics',
              icon: 'pi pi-desktop',
              route: '/products'
            },
            {
              label: 'Furniture',
              icon: 'pi pi-book',
              route: '/products'
            },
            {
              label: 'Clothing',
              icon: 'pi pi-shopping-cart',
              route: '/products'
            },
            {
              label: 'Sports',
              icon: 'pi pi-briefcase',
              route: '/products'
            },
            {
              label: 'Health',
              icon: 'pi pi-heart',
              route: '/products'
            }
          ]
        }
      ],
      brands: [
        {
          label: 'Nike',
          value: 'Nike',
          icon: 'pi pi-check',
          route: '/products',
          selected: false
        },
        {
          label: 'Adidas',
          value: 'Adidas',
          icon: 'pi pi-check',
          route: '/products',
          selected: false
        },
        {
          label: 'Puma',
          value: 'Puma',
          icon: 'pi pi-check',
          route: '/products',
          selected: false
        },
        {
          label: 'Under Armour',
          value: 'Under Armour',
          icon: 'pi pi-check',
          route: '/products',
          selected: false
        },
        {
          label: 'Reebok',
          value: 'Reebok',
          icon: 'pi pi-check',
          route: '/products',
          selected: false
        },
        {
          label: 'Asics',
          value: 'Asics',
          icon: 'pi pi-check',
          route: '/products',
          selected: false
        },
        {
          label: 'Vans',
          value: 'Vans',
          icon: 'pi pi-check',
          route: '/products',
          selected: false
        },
        {
          label: 'Converse',
          value: 'Converse',
          icon: 'pi pi-check',
          route: '/products',
          selected: false
        }
      ],
      selectedBrands: [],
      priceRange: [
        {
          label: '$50 - $100',
          value: '$50 - $100',
          icon: 'pi pi-check',
          route: '/products',
          selected: false
        },
        {
          label: '$100 - $150',
          value: '$100 - $150',
          icon: 'pi pi-check',
          route: '/products',
          selected: false
        },
        {
          label: '$150 - $200',
          value: '$150 - $200',
          icon: 'pi pi-check',
          route: '/products',
          selected: false
        },
        {
          label: '$200 - $250',
          value: '$200 - $250',
          icon: 'pi pi-check',
          route: '/products',
          selected: false
        }
      ],
      selectedPriceRange: [],
      evoulotionRate: [
        {
          label: '5 Star',
          value: '5 Star',
          icon: 'pi pi-star',
          route: '/products',
          selected: false
        },
        {
          label: '4 Star',
          value: '4 Star',
          icon: 'pi pi-star',
          route: '/products',
          selected: false
        },
        {
          label: '3 Star',
          value: '3 Star',
          icon: 'pi pi-star',
          route: '/products',
          selected: false
        },
        {
          label: '2 Star',
          value: '2 Star',
          icon: 'pi pi-star',
          route: '/products',
          selected: false
        }
      ],
      selectedEvoulotionRate: []
    }
  },
  mixins: [ToastMixin],
  created() {
    this.fetchProducts()
  },
  computed: {
    ...mapState('products', ['products', 'loading'])
  },
  methods: {
    ...mapActions('products', ['fetchProducts']),
    getSeverity(product) {
      switch (product.inventoryStatus) {
        case 'INSTOCK':
          return 'success'

        case 'LOWSTOCK':
          return 'warning'

        case 'OUTOFSTOCK':
          return 'danger'

        default:
          return null
      }
    },
    goProductDetail(product) {
      this.$router.push(`/products/${product.id}`)
    },
    addBasket(product) {
      this.addBasket(product).then(() => {
        this.showSuccessMessage('Product added to basket')
      })
    }
  }
}
</script>

<template>
  <div class="formgrid grid">
    <div class="field col-2">
      <div class="card p-3 sticky top-0">
        <PanelMenu expanded :model="categories" multiple />
        <Divider />
        <Listbox
          v-model="selectedBrands"
          :options="brands"
          :modelValue="selectedBrands"
          filter
          multiple
          optionLabel="label"
          class="w-full"
        >
          <template #option="{ option }">
            <div class="flex">
              <Checkbox
                v-model="option.selected"
                :key="option.value"
                :input-id="option.value"
                :name="option.value"
                :value="option.value"
                class="mr-3"
              />
              <label :for="option.value" class="cursor-pointer">{{ option.label }}</label>
            </div>
          </template>
        </Listbox>
        <Divider />
        <Listbox
          v-model="selectedPriceRange"
          :options="priceRange"
          :modelValue="selectedPriceRange"
          filter
          optionLabel="label"
          class="w-full"
        >
          <template #option="{ option }">
            <div class="flex">
              <RadioButton
                v-model="option.selected"
                :key="option.value"
                :input-id="option.value"
                :name="option.value"
                :value="option.value"
                class="mr-3"
              />
              <label :for="option.value" class="cursor-pointer">{{ option.label }}</label>
            </div>
          </template>
        </Listbox>
        <Divider />
        <Listbox
          v-model="selectedEvoulotionRate"
          :options="evoulotionRate"
          :modelValue="selectedEvoulotionRate"
          filter
          optionLabel="label"
          class="w-full"
        >
          <template #option="{ option }">
            <div class="flex">
              <RadioButton
                v-model="option.selected"
                :key="option.value"
                :input-id="option.value"
                :name="option.value"
                :value="option.value"
                class="mr-3"
              />
              <icon :class="option.icon" class="mr-3"></icon>
              <label :for="option.value" class="cursor-pointer">{{ option.label }}</label>
            </div>
          </template>
        </Listbox>
        <Divider />
      </div>
    </div>
    <div class="field col">
      <div class="card">
        <DataView
          :value="products"
          :layout="layout"
          :sortOrder="sortOrder"
          :sortField="sortField"
          :rows="4"
        >
          <template #header>
            <div class="flex justify-content-between">
              <Dropdown
                v-model="sortKey"
                :options="sortOptions"
                optionLabel="label"
                placeholder="Sort By Price"
                @change="onSortChange($event)"
              />
              <DataViewLayoutOptions v-model="layout" />
            </div>
          </template>

          <template #list="slotProps">
            <div v-if="!loading" class="grid grid-nogutter">
              <div v-for="(item, index) in slotProps.items" :key="index" class="col-12">
                <div
                  class="flex flex-column sm:flex-row sm:align-items-center p-4 gap-3"
                  :class="{ 'border-top-1 surface-border': index !== 0 }"
                >
                  <div class="md:w-10rem relative">
                    <img
                      class="block xl:block mx-auto border-round w-full cursor-pointer"
                      :src="item.thumbnail"
                      :alt="item.title"
                      style="height: 140px; object-fit: contain; cursor: pointer"
                      @click="goProductDetail(item)"
                    />
                    <Tag
                      :value="item.inventoryStatus"
                      :severity="getSeverity(item)"
                      class="absolute"
                      style="left: 4px; top: 4px"
                    ></Tag>
                  </div>
                  <div
                    class="flex flex-column md:flex-row justify-content-between md:align-items-center flex-1 gap-4"
                  >
                    <div
                      class="flex flex-row md:flex-column justify-content-between align-items-start gap-2"
                    >
                      <div>
                        <span class="font-medium text-secondary text-sm">{{ item.brand }}</span>
                        <div
                          class="text-lg font-medium text-900 mt-2 cursor-pointer"
                          @click="goProductDetail(item)"
                        >
                          {{ item.title }}
                        </div>
                      </div>
                      <div class="surface-100 p-1" style="border-radius: 30px">
                        <div
                          class="surface-0 flex align-items-center gap-2 justify-content-center py-1 px-2"
                          style="
                            border-radius: 30px;
                            box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.04),
                              0px 1px 2px 0px rgba(0, 0, 0, 0.06);
                          "
                        >
                          <span class="text-900 font-medium text-sm">{{ item.rating }}</span>
                          <i class="pi pi-star-fill text-yellow-500"></i>
                        </div>
                      </div>
                    </div>
                    <div class="flex flex-column md:align-items-end gap-5">
                      <span class="text-xl font-semibold text-900">${{ item.price }}</span>
                      <div class="flex flex-row-reverse md:flex-row gap-2">
                        <Button icon="pi pi-heart" outlined></Button>
                        <Button
                          icon="pi pi-shopping-cart"
                          label="Buy Now"
                          :disabled="item.inventoryStatus === 'OUTOFSTOCK'"
                          class="flex-auto md:flex-initial white-space-nowrap"
                          @click="addBasket(item)"
                        ></Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="grid grid-nogutter">
              <div v-for="i in 16" :key="i" class="col-12">
                <div
                  class="flex flex-column xl:flex-row xl:align-items-start p-4 gap-4"
                  :class="{ 'border-top-1 surface-border': i !== 0 }"
                >
                  <Skeleton
                    class="w-9 sm:w-16rem xl:w-10rem h-6rem block xl:block mx-auto border-round"
                  />
                  <div
                    class="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4"
                  >
                    <div class="flex flex-column align-items-center sm:align-items-start gap-3">
                      <Skeleton class="w-8rem border-round h-2rem" />
                      <Skeleton class="w-6rem border-round h-1rem" />
                      <div class="flex align-items-center gap-3">
                        <Skeleton class="w-6rem border-round h-1rem" />
                        <Skeleton class="w-3rem border-round h-1rem" />
                      </div>
                    </div>
                    <div
                      class="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2"
                    >
                      <Skeleton class="w-4rem border-round h-2rem" />
                      <Skeleton shape="circle" class="w-3rem h-3rem" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>

          <template #grid="slotProps">
            <div v-if="!loading" class="grid grid-nogutter">
              <div
                v-for="(item, index) in slotProps.items"
                :key="index"
                class="col-12 sm:col-6 md:col-6 lg:col-4 xl:col-3 p-2"
              >
                <div
                  class="p-4 border-1 surface-border surface-card border-round flex flex-column justify-content-between h-full"
                >
                  <div
                    class="surface-50 flex justify-content-center border-round p-3 hover:shadow-2"
                    @click="goProductDetail(item)"
                  >
                    <div class="relative mx-auto cursor-pointer">
                      <img
                        class="border-round w-full"
                        :src="item.thumbnail"
                        :alt="item.title"
                        style="width: 300px; height: 200px; object-fit: contain; cursor: pointer"
                      />
                      <Tag
                        :value="item.inventoryStatus"
                        :severity="getSeverity(item)"
                        class="absolute"
                        style="left: 4px; top: 4px"
                      ></Tag>
                    </div>
                  </div>
                  <div class="pt-4">
                    <div class="flex flex-row justify-content-start align-items-start gap-2 h-4rem">
                      <div>
                        <div
                          class="text-lg font-bold text-900 mt-1 cursor-pointer"
                          @click="goProductDetail(item)"
                        >
                          {{ item.brand }}
                        </div>
                        <div
                          class="text-lg font-medium text-900 mt-1 cursor-pointer"
                          @click="goProductDetail(item)"
                        >
                          {{ item.title }}
                        </div>
                      </div>
                    </div>
                    <div class="flex flex-column gap-4 mt-4">
                      <span class="text-2xl font-semibold text-900">${{ item.price }}</span>
                      <div class="flex gap-2">
                        <Button
                          icon="pi pi-shopping-cart"
                          label="Buy Now"
                          :disabled="item.inventoryStatus === 'OUTOFSTOCK'"
                          class="flex-auto white-space-nowrap"
                          @click="addBasket(item)"
                        ></Button>
                        <Button icon="pi pi-heart" outlined></Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="grid grid-nogutter">
              <div v-for="i in 16" :key="i" class="col-12 sm:col-6 md:col-6 lg:col-4 xl:col-3 p-2">
                <div class="p-4 border-1 surface-border surface-card border-round">
                  <div class="flex flex-wrap align-items-center justify-content-between gap-2">
                    <Skeleton class="w-6rem border-round h-2rem" />
                    <Skeleton class="w-3rem border-round h-1rem" />
                  </div>
                  <div class="flex flex-column align-items-center gap-3 py-5">
                    <Skeleton class="w-9 border-round h-10rem" />
                    <Skeleton class="w-8rem border-round h-2rem" />
                    <Skeleton class="w-6rem border-round h-1rem" />
                  </div>
                  <div class="flex align-items-center justify-content-between">
                    <Skeleton class="w-4rem border-round h-2rem" />
                    <Skeleton shape="circle" class="w-3rem h-3rem" />
                  </div>
                </div>
              </div>
            </div>
          </template>
        </DataView>
      </div>
    </div>
  </div>
</template>

<style></style>