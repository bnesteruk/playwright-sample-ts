<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-btn
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
        text
      >
        <span class="mr-2">Latest Release</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar>
    <div class="v-main__wrap">
      <div class="top-row">
        <div class="filter-row">
          <div class="date-time-members">
            <DateTimeSelect
              :defaultDate="defaultStartDate"
              :defaultTime="defaultStartTime"
              label="Start:"
              :selectedEpochDate.sync="startDateEpoch"
            />

            <DateTimeSelect
              :defaultDate="defaultEndDate"
              :defaultTime="defaultEndTime"
              label="End:"
              :selectedEpochDate.sync="endDateEpoch"
            />
          </div>
        </div>
      </div>
    </div>
  </v-app>
</template>

<style>
.top-row {
  margin: 100px;
  border: solid 1px rgba(0, 128, 0, 0.466);
  width: fit-content;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  padding-top: 5px;
  padding-bottom: 5px;
  padding-right: 20px;
  padding-left: 20px;
}

.filter-row {
  display: flex;
  flex-direction: row;
}

.date-time-members {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
</style>

<script>
import DateTimeSelect from "@/components/DateTimeSelect";

export default {
  name: "DateTimePicker",

  components: {
    DateTimeSelect
  },

  data: () => ({
    defaultStartDate: "",
    defaultStartTime: "",
    defaultEndDate: "",
    defaultEndTime: "",
    startDateEpoch: 0,
    endDateEpoch: 0,
  }),
};
</script>
