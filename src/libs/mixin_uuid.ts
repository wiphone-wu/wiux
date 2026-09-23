import { ref } from "vue";

function createId(): string {
  return Math.random().toString(36).substring(3, 8);
}

export default function () {
  const uuid = ref(createId());

  return {
    uuid,
  };
}
