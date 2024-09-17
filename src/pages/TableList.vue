<template>
  <div class="content">
    <div class="md-layout">
      <div
        class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100"
      >
        <md-card>
          <md-card-header data-background-color="green">
            <h4 class="title">Customer Information</h4>

            <form action="/action_page.php">
              <!-- <label for="cname">Search:</label><input v-model="searchTerm" placeholder="Search users..." />
              <label for="minSalary">Min Salary:</label>
              <input v-model="minSalary" placeholder="Min Salary" type="number" />
              <label for="maxSalary">Max Salary:</label>
              <input v-model="maxSalary" placeholder="Max Salary" type="number" /> -->

              <filter-notice       
              v-if="showModal"
              :customer-id="customerId"
              :sales-type="salesType"
              :min-Price="minPrice"
              :max-Price="maxPrice"
              :start-Date="startDate"
              :end-Date="endDate"
              @update-search-term="searchTerm = $event"
              @update-min-salary="minSalary = $event"
              @update-max-salary="maxSalary = $event"
              @update-start-date="startDate = $event"
              @update-end-date="endDate = $event"
              @close="closeModal"/>

              <!-- <ul>
                <li v-for="user in filteredUsers" :key="user.id">{{ user.name }}</li>
              </ul> -->
            </form>
            <md-button class="md-raised md-primary" @click="openModal">Show Active Filters</md-button>

            <p class="category">Filter customers according to id, sale type, product price and sale period</p>
          </md-card-header>
          <md-card-content>
            <customer-table :customer-id="customerId" :sales-type="salesType" :minPrice="minPrice" :maxPrice="minPrice" :startDate="startDate" :endDate="endDate"  :tableHeaderColor="green"></customer-table>
          </md-card-content>
        </md-card>
      </div>

      <div
        class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100"
      >
        <md-card class="md-card-plain">
          <md-card-header data-background-color="green">
            <h4 class="title">Table on Plain Background</h4>
            <p class="category">Here is a subtitle for this table</p>
        </md-card-header>
          <md-card-content>
            <ordered-table></ordered-table>
          </md-card-content>
        </md-card>
      </div>
    </div>
  </div>
</template>

<script>
// import { OrderedTable } from "@/components";
import FilterNotice from "@/components/Filters/FilterNotice.vue";
import CustomerTable from '../components/Tables/CustomerTable.vue';

export default {
  data() {
    return {
      salesType: '',
      customerID: null, // Customer ID
      startDate: '', // Start date
      endDate: '', // End date
      minPrice: '', // Minimum salary
      maxPrice: '', // Maximum salary
      showModal: false // Controls the visibility of the popup window
    };
  },
  components: {
    // OrderedTable,
    CustomerTable,
    FilterNotice // Register the modal component

  },
  computed: {
    // Computed property for filtering users
    filteredUsers() {
      // Convert search term to lowercase for case-insensitive search
      const lowerCaseSearchTerm = this.searchTerm.toLowerCase();

      // Filter users by matching the search term with user names
      return this.users.filter(user =>
        user.name.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }
},
methods: {
    openModal() {
      this.showModal = true; // Show the popup
    },
    closeModal() {
      this.showModal = false; // Hide the popup
    },
  }
};
</script>
