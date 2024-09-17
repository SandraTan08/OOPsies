<template>
  <div>
    <md-table v-model="filteredUsers" :table-header-color="tableHeaderColor">
      <md-table-row slot="md-table-row" slot-scope="{ item }">
        <md-table-cell md-label="Name">{{ item.name }}</md-table-cell>
        <md-table-cell md-label="Country">{{ item.country }}</md-table-cell>
        <md-table-cell md-label="City">{{ item.city }}</md-table-cell>
        <md-table-cell md-label="Salary">{{ item.salary }}</md-table-cell>
      </md-table-row>
    </md-table>
  </div>
</template>

<script>
export default {
  name: "customer-table",
  props: {
    tableHeaderColor: {
      type: String,
      default: "",
    },
    searchTerm: {
      type: String,
      default: ""
    },
    minSalary: {
      type: Number, // Expecting a number from the parent
      default: null
    },
    maxSalary: {
      type: Number, // Expecting a number from the parent
      default: null
    }
  },
  data() {
    return {
      selected: [],
      users: [
        {
          name: "Dakota Rice",
          salary: "$36,738",
          country: "Niger",
          city: "Oud-Turnhout",
        },
        {
          name: "Minerva Hooper",
          salary: "$23,738",
          country: "Curaçao",
          city: "Sinaai-Waas",
        },
        {
          name: "Sage Rodriguez",
          salary: "$56,142",
          country: "Netherlands",
          city: "Overland Park",
        },
        {
          name: "Philip Chaney",
          salary: "$38,735",
          country: "Korea, South",
          city: "Gloucester",
        },
        {
          name: "Doris Greene",
          salary: "$63,542",
          country: "Malawi",
          city: "Feldkirchen in Kārnten",
        },
        {
          name: "Mason Porter",
          salary: "$78,615",
          country: "Chile",
          city: "Gloucester",
        },
        {
          customerid: "9",
          sales_types: "Marketing",
          product_price: "$16.93",
          sales_date: "26-03-2024",
        }
      ],
    };
  },
  computed: {
    // Computed property to filter the users based on the searchTerm prop
    filteredUsers() {
      const lowerCaseSearchTerm = this.searchTerm.toLowerCase();

      return this.users.filter(user => {
        // Extract numerical salary from the salary string (removes '$' and commas)
        const salaryNumber = parseFloat(user.salary.replace(/[\$,]/g, ''));

        // Filter by name if search term exists
        const matchesName = user.name.toLowerCase().includes(lowerCaseSearchTerm);

        // Filter by salary range, only if the salary limits are provided
        const isAboveMinSalary = this.minSalary ? salaryNumber >= this.minSalary : true;
        const isBelowMaxSalary = this.maxSalary ? salaryNumber <= this.maxSalary : true;

        // Only return users that match both the name and salary criteria
        return matchesName && isAboveMinSalary && isBelowMaxSalary;
        
      });
    }
  }
};
</script>
