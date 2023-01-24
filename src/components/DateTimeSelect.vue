<template>
  <div class="date-time-wrapper">
    <div class="date-title" :style="{ width: '60px' }">{{ label }}</div>
    <v-menu
      v-model="dateMenu"
      :close-on-content-click="false"
      transition="scale-transition"
      offset-y
      min-width="auto"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-text-field
          v-model="dateFormatted"
          class="date-text"
          hide-details
          readonly
          v-bind="attrs"
          v-on="on"
        >
        </v-text-field>
      </template>
      <v-date-picker   
        no-title
        v-model="date"
        @input="dateMenu = false"
        elevation="15"
      >
      </v-date-picker>
    </v-menu>

    <v-menu
      ref="timeMenu"
      v-model="timeMenu"
      :close-on-content-click="false"
      :return-value.sync="time"
      transition="scale-transition"
      offset-y
      max-width="290px"
      min-width="290px"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-text-field
          v-model="timeFormatted"
          class="time-picker-text time-text"
          hide-details
          readonly
          v-bind="attrs"
          v-on="on"
        >
        </v-text-field>
      </template>
      <v-time-picker
        format="ampm"
        no-title
        v-if="timeMenu"
        v-model="time"
        value="time"
      >
        <v-spacer></v-spacer>
        <v-btn text color="primary" @click="timeMenu = false">Cancel</v-btn>
        <v-btn text color="primary" @click="$refs.timeMenu.save(time)"
          >OK</v-btn
        >
      </v-time-picker>
    </v-menu>
  </div>
</template>

<style scoped lang="scss">
.time-text input {
  color: rgba(0, 128, 0, 0.466) !important;
  user-select: none !important;
}

.date-time-wrapper {
  color: rgba(0, 128, 0, 0.466);
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  height: 40px;
  overflow: hidden;
}

.date-text {
  width: 100px;
  margin: 0 !important;
  padding: 0 !important;
}

.time-picker-text {
  width: 100px;
  margin-top: 0 !important;
  padding: 0 !important;
  margin-left: 5px;
}

.date-title {
  color: #1976d2;
  margin-right: 10px;
  margin-top: 5px;
  text-align: left;
  margin-left: 15px;
}
</style>

<script>
export default {
  props: {
    label: String,
    defaultDate: String,
    defaultTime: String,
  },

  data() {
    return {
      dateFormatted: "",
      timeFormatted: "",

      dateMenu: false,
      timeMenu: false,
      date: null,
      time: null,
    };
  },

  watch: {
    date() {
      this.dateFormatted = this.formatDate(this.date);
      this.$emit("update:selectedDate", this.date);
      this.syncDate();
    },

    time() {
      this.timeFormatted = this.formatTime(this.time);
      this.$emit("update:selectedTime", this.timeFormatted);
      this.syncDate();
    },
  },

  mounted() {
    this.date = new Date().toISOString().substr(0, 10);
    this.time = new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  },

  methods: {
    syncDate() {
      const [year, month, day] = this.date.split("-");
      const [hour, minute] = this.time.split(":");
      const selectedDate = new Date(
        +year,
        month - 1,
        +day,
        +hour,
        +minute,
        0,
        0
      );
      const epochValue = selectedDate.getTime();
      this.$emit("update:selectedEpochDate", epochValue);
    },

    formatDate(date) {
      if (!date) return null;
      const [year, month, day] = date.split("-");
      return `${parseInt(month, 10)}/${day}/${year}`;
    },

    formatTime(time) {
      if (!time) return null;
      let [hour, minute] = time.split(":");

      const timeFormat = +hour < 12 ? "AM" : "PM";
      hour = +hour === 0 ? 24 : +hour;

      const ampmHour = hour > 12 ? hour - 12 : hour;
      return `${ampmHour}:${minute} ${timeFormat}`;
    },
  },
};
</script>
