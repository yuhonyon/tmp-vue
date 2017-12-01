<template>
  <div id="hospitalizationList">
    <table>
      <thead>
        <tr>
          <th>
            医院
          </th>
          <th>
            类型
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            医院1
          </td>
          <td>
            三甲
          </td>
        </tr>
        <tr>
          <td>
            医院1
          </td>
          <td>
            三甲
          </td>
        </tr>
        <tr>
          <td>
            医院1
          </td>
          <td>
            三甲
          </td>
        </tr>
        <tr>
          <td>
            医院1
          </td>
          <td>
            三甲
          </td>
        </tr>
        <tr>
          <td>
            医院1
          </td>
          <td>
            三甲
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
export default {
  name: "hospitalizationList",
  data: () => ({

  })
}
</script>
<style  scoped>
table{
  width:100%;
  border: 1px solid #000;
}
td,th{
  border: 1px solid #000;
  height: 50px;
}
</style>
