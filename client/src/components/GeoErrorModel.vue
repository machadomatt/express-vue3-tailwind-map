<template>
  <div
    class="h-screen absolute w-full z-10 flex justify-center items-start pt-[125px] bg-black/50"
  >
    <div
      class="flex flex-col bg-white w-[80%] sm:w-[450px] px-6 py-4 rounded-md"
    >
      <h1 class="mb-1 text-lg">Error: {{ geoErrorMsg }}</h1>
      <p class="mb-4 text-sm">
        To take advantage of this applications features, please ensure location
        services are enabled.
      </p>
      <button
        @click="$emit('closeGeoError')"
        class="self-start px-4 py-2 text-sm text-white bg-red-500 rounded-md"
      >
        Close
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    geoErrorMsg: String,
  },
};
</script>
