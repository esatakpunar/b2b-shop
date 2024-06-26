<script>
import { mapActions } from 'vuex'
import { FilterMatchMode } from 'primevue/api'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'

export default {
  data() {
    return {
      products: null,
      productDialog: false,
      deleteProductDialog: false,
      deleteProductsDialog: false,
      product: {
        images: [],
        active: true
      },
      selectedProducts: [],
      filters: {},
      submitted: false,
      items: [],
      isLoading: false,
      brands: [],
      categories: [],
      uploadLoading: false,
    }
  },
  components: {
    IconField,
    InputIcon
  },
  computed: {
    selectedCategory: {
      get() {
        return null
      },
      set(value) {
        this.product.category = value
      }
    }
  },
  created() {
    this.initFilters()
    this.fetchData()
    this.fetchCategories()
    this.fetchBrands()
  },
  methods: {
    ...mapActions('managementTable', [
      'fetchTableDatas',
      'deleteTableData',
      'addItem',
      'updateItem'
    ]),
    ...mapActions('adminPanel', ['uploadImage']),
    fetchData() {
      this.isLoading = true

      return this.fetchTableDatas({
        url: '/product'
      })
        .then(({ data }) => {
          this.items = data
          this.total = data.length
        })
        .catch((error) => {
          this.$toast.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message,
            life: 3000
          })
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    fetchCategories() {
      return this.fetchTableDatas({
        url: '/category'
      })
        .then(({ data }) => {
          this.categories = data
        })
        .catch((error) => {
          this.showErrorMessage(error.message)
        })
    },
    fetchBrands() {
      return this.fetchTableDatas({
        url: '/brand'
      })
        .then(({ data }) => {
          this.brands = data
        })
        .catch((error) => {
          this.showErrorMessage(error.message)
        })
    },
    onGroupChange(event) {
      this.product.category = event.value
    },
    formatCurrency(value) {
      if (value) return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })

      return
    },
    openNew() {
      this.product = {
        active: true
      }
      this.submitted = false
      this.productDialog = true
    },
    hideDialog() {
      this.productDialog = false
      this.submitted = false
    },
    saveProduct() {
      this.saveLoading = true;
      this.submitted = true

      if (this.product?.name?.trim()) {
        if (this.product.id) {
          this.updateItem({
            url: `/product/${this.product.id}`,
            data: this.product
          })
            .then(() => {
              this.fetchData()
            })
            .catch((error) => {
              this.$toast.add({
                severity: 'error',
                summary: 'Error',
                detail: error.message,
                life: 3000
              })
            })
            .finally(() => {
              this.saveLoading = false;
              this.productDialog = false
              this.product = {}
            })
        } else {
          this.addItem({
            url: '/product',
            data: this.product
          })
            .then(() => {
              this.fetchData()
            })
            .catch((error) => {
              this.$toast.add({
                severity: 'error',
                summary: 'Error',
                detail: error.message,
                life: 3000
              })
            })
            .finally(() => {
              this.saveLoading = false;
              this.productDialog = false
              this.product = {}
            })
        }
      }
    },
    editProduct(product) {
      console.log('product', product)
      delete product.category.parentCategory
      this.product = { ...product }
      this.productDialog = true
    },
    confirmDeleteProduct(product) {
      this.product = product
      this.deleteProductDialog = true
    },
    deleteSelectedProducts() {
      this.isLoading = true

      return this.deleteTableData({
        url: `/product/${this.product.id}`
      })
        .then(() => {
          this.fetchData()
          this.deleteProductDialog = false
        })
        .catch((error) => {
          this.$toast.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message,
            life: 3000
          })
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    initFilters() {
      this.filters = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
      }
    },
    getStatusLabel(status) {
      switch (status) {
        case 'Active':
          return 'success'

        case 'Inactive':
          return 'warning'

        default:
          return null
      }
    },
    myUploader(event) {
      const files = event.files
      const uploadPromises = []

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const reader = new FileReader()
        reader.readAsDataURL(file)

        reader.onload = () => {
          const formData = new FormData()
          formData.append('file', file)

          const uploadPromise = this.uploadImage(formData).then(({ data }) => {
            if (!Array.isArray(this.product.images)) {
              this.product.images = []
            }

            this.product.images.push({
              url: data[0],
              isThumbnail: this.product.images.length === 0
            })
          })

          uploadPromises.push(uploadPromise)
        }
      }

      Promise.all(uploadPromises)
        .then(() => {
          console.log('All images uploaded successfully')
        })
        .catch((error) => {
          console.error('Error uploading images:', error)
        })
    },
    selectMainPicture(index) {
      this.product.images.forEach((image) => {
        image.isThumbnail = false
      })

      const selectedImage = this.product.images[index]
      selectedImage.isThumbnail = true
    },
    getThumbnail(images) {
      return images.find((image) => image.isThumbnail)
        ? images.find((image) => image.isThumbnail)
        : images[0]
    },
    calculateGrossPrice(salesPrice) {
      let grossPrice = salesPrice * (1 + this.product.vatRate / 100)
      this.product.grossPrice = grossPrice.toFixed(2)
    },
    calculateSalesPrice(grossPrice) {
      let salesPrice = grossPrice / (1 + this.product.vatRate / 100)
      this.product.salesPrice = salesPrice.toFixed(2)
    }
  }
}
</script>

<template>
  <div>
    <Toolbar class="mb-2">
      <template #start>
        <Button label="New" icon="pi pi-plus" severity="success" class="mr-2" @click="openNew" />
        <Button
          icon="pi pi-refresh"
          severity="info"
          class="mr-2"
          :loading="isLoading"
          @click="fetchData"
        />
      </template>
    </Toolbar>

    <DataTable
      :value="items"
      v-model:selection="selectedProducts"
      size="small"
      dataKey="id"
      :loading="isLoading"
      :paginator="true"
      :rows="10"
      :filters="filters"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      :rowsPerPageOptions="[5, 10, 25]"
      currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
      scrollable
      scrollHeight="calc(100vh - 249px)"
    >
      <template #header>
        <div class="flex flex-wrap gap-2 align-items-center justify-content-between">
          <h4 class="m-0">{{ Products }}</h4>
          <IconField iconPosition="left">
            <InputIcon>
              <i class="pi pi-search" />
            </InputIcon>
            <InputText v-model="filters['global'].value" placeholder="Search..." />
          </IconField>
        </div>
      </template>
      <Column field="id" header="ID" sortable style="min-width: 4rem"></Column>
      <Column field="code" header="Code" sortable style="min-width: 10rem"></Column>
      <Column field="name" header="Name" sortable style="min-width: 14rem"></Column>
      <Column header="Image">
        <template #body="slotProps">
          <img
            v-if="slotProps.data.images.length"
            :src="getThumbnail(slotProps.data.images)?.url"
            :alt="getThumbnail(slotProps.data.images)?.id"
            class="border-round"
            style="width: 64px"
          />
        </template>
      </Column>
      <!-- <Column field="salesPrice" header="Sales Price" sortable style="min-width: 8rem">
        <template #body="slotProps">
          {{ formatCurrency(slotProps.data.salesPrice) }}
        </template>
      </Column> -->
      <Column field="grossPrice" header="Gross Price" sortable style="min-width: 8rem">
        <template #body="slotProps">
          {{ formatCurrency(slotProps.data.grossPrice) }}
        </template>
      </Column>
      <Column field="vatRate" header="VAT Rate" sortable style="min-width: 6rem">
        <template #body="slotProps"> {{ slotProps.data.vatRate }}% </template>
      </Column>
      <Column field="category" header="Category" sortable style="min-width: 10rem">
        <template #body="slotProps">
          {{ slotProps.data.category?.name }}
        </template>
      </Column>
      <Column field="stock" header="Stock" sortable style="min-width: 6rem"></Column>
      <Column field="active" header="Status" sortable style="min-width: 6rem">
        <template #body="slotProps">
          <Tag
            :value="slotProps.data.active ? 'Active' : 'Inactive'"
            :severity="getStatusLabel(slotProps.data.active ? 'Active' : 'InActive')"
          />
        </template>
      </Column>
      <Column :exportable="false" style="min-width: 7rem">
        <template #body="slotProps">
          <Button
            icon="pi pi-pencil"
            outlined
            rounded
            class="mr-2"
            @click="editProduct(slotProps.data)"
          />
          <Button
            icon="pi pi-trash"
            outlined
            rounded
            severity="danger"
            @click="confirmDeleteProduct(slotProps.data)"
          />
        </template>
      </Column>
    </DataTable>

    <Dialog
      v-model:visible="productDialog"
      :style="{ width: '450px' }"
      header="Product Details"
      :modal="true"
      class="p-fluid"
    >
      <img
        v-for="(image, index) in product.images"
        :key="image.id"
        :src="image.imageUrl ? image.imageUrl : image.url"
        :alt="image.imageUrl"
        width="75"
        height="75"
        class="inline m-auto pb-3 mr-1 border-1 border-round"
        :class="image.isThumbnail ? 'border-orange-500' : ''"
        @click="selectMainPicture(index)"
      />
      <div class="field">
        <label for="image">Image</label>
        <FileUpload
          mode="basic"
          name="demo[]"
          url="api/image"
          accept="image/*"
          customUpload
          :loading="uploadLoading"
          @uploader="myUploader"
          :auto="true"
          :multiple="true"
        />
      </div>
      <div class="field">
        <label for="code">Code</label>
        <InputText
          id="code"
          v-model.trim="product.code"
          required="true"
          :invalid="submitted && !product.code"
        />
        <small class="p-error" v-if="submitted && !product.code">Code is required.</small>
      </div>
      <div class="field">
        <label for="name">Name</label>
        <InputText
          id="name"
          v-model.trim="product.name"
          required="true"
          :invalid="submitted && !product.name"
        />
        <small class="p-error" v-if="submitted && !product.name">Name is required.</small>
      </div>
      <div class="field">
        <label for="gtin">GTIN</label>
        <InputText id="gtin" v-model.trim="product.gtin" />
      </div>
      <div class="field">
        <label for="description">Description</label>
        <Textarea
          id="description"
          v-model="product.description"
          required="true"
          rows="3"
          cols="20"
        />
      </div>

      <div class="field">
        <label for="active">Status</label>
        <InputSwitch id="active" v-model="product.active" class="ml-2" />
      </div>

      <div class="field">
        <label for="stock">Stock</label>
        <InputNumber id="stock" v-model="product.stock" integeronly />
      </div>

      <div class="field">
        <label for="brand">Brand</label>
        <Dropdown
          id="brand"
          v-model="product.brand"
          :options="brands"
          optionLabel="name"
          placeholder="Select a Brand"
        />
      </div>
      <div class="field">
        <label for="category">Category</label>
        <CascadeSelect
          v-model="selectedCategory"
          id="category"
          :options="categories"
          optionLabel="name"
          optionGroupLabel="name"
          :optionGroupChildren="['subCategories', 'subCategories']"
          placeholder="Select a Category"
          @group-change="onGroupChange"
        />
      </div>
      <div class="field">
        <label for="vatRate">VAT Rate</label>
        <InputNumber id="vatRate" v-model="product.vatRate" mode="decimal" prefix="%" />
      </div>
      <div class="formgrid grid">
        <div class="field col">
          <label for="price">Sales Price</label>
          <InputNumber
            v-model="product.salesPrice"
            :key="product.salesPrice"
            id="price"
            mode="currency"
            currency="USD"
            locale="tr-tr"
            @blur="calculateGrossPrice(product.salesPrice)"
          />
        </div>
        <div class="field col">
          <label for="cost">Gross Price</label>
          <InputNumber
            :key="product.grossPrice"
            id="cost"
            v-model="product.grossPrice"
            mode="currency"
            currency="USD"
            locale="tr-tr"
            @blur="calculateSalesPrice(product.grossPrice)"
          />
        </div>
      </div>
      <template #footer>
        <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
        <Button label="Save" icon="pi pi-check" text :loading="saveLoading" @click="saveProduct" />
      </template>
    </Dialog>

    <Dialog
      v-model:visible="deleteProductDialog"
      :style="{ width: '450px' }"
      header="Confirm"
      :modal="true"
    >
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
        <span v-if="product"
          >Are you sure you want to delete <b>{{ product.name }}</b
          >?</span
        >
      </div>
      <template #footer>
        <Button label="No" icon="pi pi-times" text @click="deleteProductDialog = false" />
        <Button label="Yes" icon="pi pi-check" text @click="deleteSelectedProducts" />
      </template>
    </Dialog>
  </div>
</template>
