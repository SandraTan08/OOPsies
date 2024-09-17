<template>
  <div class="popup-overlay">
    <div class="popup-content">
      <h3>Active Filters</h3>

      <!-- User ID Input -->
      <label for="userID">User ID:</label>
      <input
        v-model="localUserID"
        @input="$emit('update-user-id', localUserID)"
        placeholder="User ID"
        type="number"
      />

      <!-- Sales Type Input -->
      <label for="salesType">Sales Type:</label>
      <input
        v-model="localSalesType"
        @input="$emit('update-sales-type', localSalesType)"
        placeholder="Sales type..."
      />

      <!-- Min Price Input -->
      <label for="minprice">Min Price:</label>
      <input
        v-model="localMinPrice"
        @input="$emit('update-min-price', localMinPrice)"
        placeholder="Min Price"
        type="number"
      />

      <!-- Max Price Input -->
      <label for="maxprice">Max Price:</label>
      <input
        v-model="localMaxPrice"
        @input="$emit('update-max-price', localMaxPrice)"
        placeholder="Max Price"
        type="number"
      />

      <!-- Date Picker -->
      <DatePicker v-model="date" />

      <p v-if="localMinPrice">Minimum Price: {{ localMinPrice }}</p>
      <p v-if="localMaxPrice">Maximum Price: {{ localMaxPrice }}</p>

      <p v-if="!localMaxPrice && !localMinPrice">No filters applied.</p>

      <!-- Close button -->
      <md-button class="md-raised md-primary" @click="closePopup">Close</md-button>
    </div>
  </div>
</template>

<script>
import DatePicker from 'primevue/datepicker';

export default {
  props: {
    userID: {
      type: Number,
      default: null,
    },
    salestype: {
      type: String,
      default: '',
    },
    minPrice: {
      type: Number,
      default: null,
    },
    maxPrice: {
      type: Number,
      default: null,
    },
    startDate: {
      type: String,
      default: '',
    },
    endDate: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      localUserID: this.userID,
      localSalesType: this.salestype,
      localMinPrice: this.minPrice,
      localMaxPrice: this.maxPrice,
      date: null,
    };
  },
  methods: {
    closePopup() {
      this.$emit('close'); // Emit close event to the parent
    },
  },
  watch: {
    // Ensure prop updates propagate to local data
    userID(newVal) {
      this.localUserID = newVal;
    },
    salestype(newVal) {
      this.localSalesType = newVal;
    },
    minPrice(newVal) {
      this.localMinPrice = newVal;
    },
    maxPrice(newVal) {
      this.localMaxPrice = newVal;
    },
  },
};
</script>

<style scoped>
/* Overlay to cover the whole screen */
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1001; /* Ensure the popup is above everything */
  pointer-events: all; /* Ensure you can interact with the popup */
}

/* Popup content styling */
.popup-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 400px;
  width: 100%;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 1001; /* Ensure content is above overlay */
  pointer-events: all; /* Allow interaction inside the popup */
}

/* To prevent clicks from going through overlay */
.popup-overlay::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999; /* Layer below the popup content */
  pointer-events: none;
}
</style>
