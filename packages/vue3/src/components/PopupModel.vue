<template>
  <div>
    <div id="modal-js-example" class="modal is-active">
      <div class="modal-background"></div>

      <div class="modal-content">
        <div class="box">
          <p>Modal JS example</p>
          <!-- Your content -->
        </div>
      </div>

      <button class="modal-close is-large" aria-label="close"></button>
    </div>
    <button class="js-modal-trigger" data-target="modal-js-example">
      {{ title }}
    </button>
  </div>

</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

export default defineComponent({
  props: {
    title: {
      type: String as PropType<string>,
      required: true,
    },
  },
});

document.addEventListener('DOMContentLoaded', () => {
  // Functions to open and close a modal
  function openModal($el: HTMLElement) {
    $el.classList.add('is-active');
  }

  function closeModal($el: Element) {
    $el.classList.remove('is-active');
  }

  function closeAllModals() {
    (document.querySelectorAll('.modal') || []).forEach(($modal) => {
      closeModal($modal);
    });
  }

  // Add a click event on buttons to open a specific modal
  (document.querySelectorAll('.js-modal-trigger') || []).forEach(($trigger) => {
    const modal = $trigger.dataset.target;
    const $target = document.getElementById(modal);

    $trigger.addEventListener('click', () => {
      openModal($target);
    });
  });

  // Add a click event on various child elements to close the parent modal
  (document.querySelectorAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button') || []).forEach(($close) => {
    const $target = $close.closest('.modal');

    $close.addEventListener('click', () => {
      closeModal($target);
    });
  });

  // Add a keyboard event to close all modals
  document.addEventListener('keydown', (event) => {
    const e = event || window.event;

    if (e.keyCode === 27) { // Escape key
      closeAllModals();
    }
  });
});
</script>
<style scoped>
@import "https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css";
</style>
