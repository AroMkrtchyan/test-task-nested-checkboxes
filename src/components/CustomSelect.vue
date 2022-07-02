<template>
  <div class="select-container">
    <div class="custom_options" @click.stop="toggleDropDown">
      <span
        v-if="getSelectedProducts.length === 0"
        class="font-light placeholder"
      >
        Select your favorite(s)...
      </span>
      <div v-else class="chips-container">
        <div
          v-for="list in getSelectedProducts"
          :key="list.id"
          class="chip"
          @click.stop
        >
          <div class="chip-label" v-html="getProductLabel(list)"></div>
          <img
            class="remove"
            src="../../src/assets/icons/remove_chip_icon.svg"
            alt="clear"
            @click.stop="removeChip(list)"
          />
        </div>
      </div>
      <div v-if="isOpenDropDownList" class="dropdown" @click.stop>
        <div v-for="item in selectData" :key="item.id">
          <label>
            <img
              class="checkbox"
              width="14px"
              src="../assets/icons/selector.svg"
              v-if="
                optionsValue[item.id].length > 0 &&
                optionsValue[item.id].length < item.children.length
              "
            />
            <input
              :checked="optionsValue[item.id].length === item.children.length"
              type="checkbox"
              class="checkbox"
              :class="[
                optionsValue[item.id].length > 0 &&
                optionsValue[item.id].length < item.children.length
                  ? 'hide'
                  : 'show',
              ]"
              @change="
                (event) => parentCheckboxHandler(item.id, event.target.checked)
              "
            />
            <span>{{ item.label }}</span>
          </label>
          <div
            v-for="childItem in item.children"
            :key="childItem.id"
            class="childList"
          >
            <label>
              <input
                type="checkbox"
                class="checkbox"
                :value="childItem.id"
                v-model="optionsValue[item.id]"
              />
              <span v-html="childItem.label" class="dropdown-item"></span>
            </label>
          </div>
        </div>
      </div>

      <div class="select_actions">
        <img
          v-if="getSelectedProducts.length"
          @click.stop="clearSelectedProducts"
          class="remove-icon"
          src="../../src/assets/icons/remove_icon.svg"
          alt="clear"
        />
        <img
          :class="{ rotate: isOpenDropDownList }"
          class="select-icon"
          src="../../src/assets/icons/select-arrow.svg"
          alt="arrow"
        />
      </div>
    </div>

    <div class="json-container">
      <pre>
        {{ getSelectedProducts }}
      </pre>
    </div>
  </div>
</template>

<script>
export default {
  name: "custom-select",
  data: () => {
    return {
      isOpenDropDownList: false,
      optionsValue: {},
    };
  },
  props: ["selectData", "getSelectedProducts"],
  methods: {
    toggleDropDown() {
      this.isOpenDropDownList = !this.isOpenDropDownList;
    },
    outsideClick() {
      this.isOpenDropDownList = false;
    },
    clearSelectedProducts() {
      for (let key in this.optionsValue) {
        this.optionsValue[key] = [];
      }
    },
    parentCheckboxHandler(val, checked) {
      if (checked) {
        this.selectData
          .find((item) => item.id === val)
          .children.forEach((item) => {
            if (!this.optionsValue[val].includes(item.id)) {
              this.optionsValue[val].push(item.id);
            }
          });
      } else {
        this.optionsValue[val] = [];
      }
    },
    removeChip(name) {
      if (this.selectData.find((item) => item.id === name)) {
        this.optionsValue[name] = [];
        return;
      }
      for (let key in this.optionsValue) {
        let itemIndex = this.optionsValue[key].indexOf(name);
        if (itemIndex !== -1) {
          this.optionsValue[key].splice(itemIndex, 1);
          break;
        }
      }
    },
    getProductLabel(id) {
      let label = "";
      if (this.selectData.find((item) => item.id === id)) {
        label = this.selectData.find((item) => item.id === id).label;
      } else {
        this.selectData.forEach((item) => {
          if (item.children.find((item) => item.id === id)) {
            label = item.children.find((item) => item.id === id).label;
          }
        });
      }
      return label;
    },
  },
  watch: {
    optionsValue: {
      deep: true,
      handler() {
        let payload = [];
        for (let key in this.optionsValue) {
          if (
            this.optionsValue[key].length ===
            this.selectData.find((item) => item.id === key).children.length
          ) {
            payload = [...payload, key];
          } else {
            payload = [...payload, ...this.optionsValue[key]];
          }
        }
        this.$emit("change", payload);
      },
    },
  },
  mounted() {
    document.body.addEventListener("click", this.outsideClick);
    this.selectData.forEach((item) => {
      this.$set(this.optionsValue, item.id, []);
    });
  },
  beforeDestroy() {
    document.body.removeEventListener("click", this.outsideClick);
  },
};
</script>

<style scoped>
.select-container {
  display: flex;
  flex-direction: column;
  width: 80%;
  border-radius: 10px;
  border: 1px solid #c9c9c9;
  padding: 10px;
}
.dropdown {
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #fff;
  border: 1px solid #c9c9c9;
  padding: 10px;
  cursor: default;
}
.dropdown label {
  align-items: center;
  cursor: pointer;
}
.checkbox {
  margin-right: 10px;
}
.custom_options {
  display: flex;
  justify-content: space-between;
  border: 1px solid #c9c9c9;
  border-radius: 5px;
  width: 100%;
  padding: 5px 10px;
  position: relative;
  cursor: pointer;
}

.json-container {
  margin-top: 15px;
  border-radius: 5px;
  background-color: #c9c9cc94;
  padding: 5px 10px;
}
.select_actions {
  display: flex;
  align-items: center;
}
.select_actions .remove-icon {
  margin-right: 10px;
}
.chips-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: flex-start;
  cursor: default;
}
.chip {
  background-color: #e4f2fd;
  padding: 5px;
  border-radius: 3px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #34abe4;
}
.chip > img {
  margin-left: 10px;
  width: 10px;
  height: 10px;
}
.childList {
  margin-left: 24px;
}
.rotate {
  transform: rotate(180deg);
}
.dropdown-item {
  line-height: 24px;
}
.font-light {
  color: #e7e7e9;
}
.remove {
  cursor: pointer;
}
.show {
  display: inline-block;
}
.hide {
  display: none;
}
.placeholder {
  line-height: 31px;
}
.chip-label {
  line-height: 21px;
}
</style>
