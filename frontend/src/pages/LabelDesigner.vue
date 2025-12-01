<template>
  <q-page class="flex column">
    <div class="q-pa-md">
      <div class="row justify-center">
        <div class="col-12">
          <h4 class="text-center q-mb-md">Label Designer</h4>
          <p class="text-center text-grey-6">Design your custom labels here</p>
        </div>
      </div>

      <!-- Placeholder content for now -->
      <div class="row q-gutter-md justify-center">
        <q-card class="col-md-8 col-xs-12" flat bordered>
          <q-card-section>
            <div class="text-h6">Canvas Area</div>
            <div class="text-caption text-grey-6">Label design canvas will go here</div>
          </q-card-section>

          <q-card-section class="bg-grey-1" style="min-height: 400px;">
            <div class="flex flex-center full-height text-grey-5">
              <div class="text-center">
                <q-icon name="design_services" size="4rem" class="q-mb-md" />
                <div class="text-h6">Design Canvas</div>
                <div class="text-caption">Coming soon...</div>
              </div>
            </div>
          </q-card-section>
        </q-card>

        <q-card class="col-md-3 col-xs-12" flat bordered>
          <q-card-section>
            <div class="text-h6">Tools</div>
            <div class="text-caption text-grey-6">Design tools and properties</div>
          </q-card-section>

          <q-card-section>
            <q-list>
              <q-item>
                <q-item-section avatar>
                  <q-icon name="text_fields" />
                </q-item-section>
                <q-item-section>Text</q-item-section>
              </q-item>

              <q-item>
                <q-item-section avatar>
                  <q-icon name="crop_din" />
                </q-item-section>
                <q-item-section>Rectangle</q-item-section>
              </q-item>

              <q-item>
                <q-item-section avatar>
                  <q-icon name="qr_code" />
                </q-item-section>
                <q-item-section>Barcode</q-item-section>
              </q-item>

              <q-item>
                <q-item-section avatar>
                  <q-icon name="image" />
                </q-item-section>
                <q-item-section>Image</q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
// Label designer logic will go here
</script>

<style scoped>
/* Designer-specific styles */
</style>
