import Mock from 'mockjs';

if (typeof window !== 'undefined') {
  Mock.mock(/\/common\/lov\/dataset\/LOV_CODE/, {
    rows: [{
      _token: '5fd2371f43d3c75c44682b0750e7bfb5',
      objectVersionNumber: 2,
      code: 'HR.EMPLOYEE_GENDER',
      codeId: 10001,
      codeValues: null,
      description: '性别',
      type: 'USER',
      enabledFlag: 'Y',
      parentCodeId: null,
      parentCodeDescription: null,
    }, {
      _token: 'd8f3d1a86b47be97d570220f09f9da70',
      objectVersionNumber: 1,
      code: 'HR.EMPLOYEE_STATUS',
      codeId: 10002,
      codeValues: null,
      description: '员工状态',
      type: 'USER',
      enabledFlag: 'Y',
      parentCodeId: null,
      parentCodeDescription: null,
    }, {
      _token: 'fef2a3f782a4aef3f550590981f54b11',
      objectVersionNumber: 1,
      code: 'SYS.ALIGN_TYPE',
      codeId: 10003,
      codeValues: null,
      description: '对齐方式',
      type: 'USER',
      enabledFlag: 'Y',
      parentCodeId: null,
      parentCodeDescription: null,
    }, {
      _token: 'f2d56a73573733af27b46d981771f692',
      objectVersionNumber: 1,
      code: 'SYS.CAPTCHA_POLICY',
      codeId: 10004,
      codeValues: null,
      description: '验证码策略',
      type: 'USER',
      enabledFlag: 'Y',
      parentCodeId: null,
      parentCodeDescription: null,
    }, {
      _token: '690beb6510bccb2eeb906c736f7cfdc9',
      objectVersionNumber: 1,
      code: 'SYS.LOV_EDITOR_TYPE',
      codeId: 10005,
      codeValues: null,
      description: 'LOV编辑器类型',
      type: 'USER',
      enabledFlag: 'Y',
      parentCodeId: null,
      parentCodeDescription: null,
    }, {
      _token: '1d600f30fa2bfbf98061c8a3cb9a7c6c',
      objectVersionNumber: 1,
      code: 'SYS.PRIORITY_LEVEL',
      codeId: 10006,
      codeValues: null,
      description: '模板优先级',
      type: 'USER',
      enabledFlag: 'Y',
      parentCodeId: null,
      parentCodeDescription: null,
    }, {
      _token: '457a1217cc9343c41d41d5de1e2d6f1e',
      objectVersionNumber: 1,
      code: 'SYS.PROFILE_LEVEL_ID',
      codeId: 10007,
      codeValues: null,
      description: '配置文件级别',
      type: 'USER',
      enabledFlag: 'Y',
      parentCodeId: null,
      parentCodeDescription: null,
    }, {
      _token: '50f8dd1303a2c82557246dc296cc9d94',
      objectVersionNumber: 1,
      code: 'SYS.RESOURCE_TYPE',
      codeId: 10008,
      codeValues: null,
      description: '资源类型',
      type: 'USER',
      enabledFlag: 'Y',
      parentCodeId: null,
      parentCodeDescription: null,
    }, {
      _token: 'a8830b9049e26a3b2cdd851d42a02b97',
      objectVersionNumber: 1,
      code: 'SYS.TIME_ZONE',
      codeId: 10009,
      codeValues: null,
      description: '时区',
      type: 'USER',
      enabledFlag: 'Y',
      parentCodeId: null,
      parentCodeDescription: null,
    }, {
      _token: '11cb91cfc0d1d59335ba6607e42c640c',
      objectVersionNumber: 1,
      code: 'SYS.USER_STATUS',
      codeId: 10010,
      codeValues: null,
      description: '用户状态',
      type: 'USER',
      enabledFlag: 'Y',
      parentCodeId: null,
      parentCodeDescription: null,
    }],
    success: true,
    total: 35,
  });

  Mock.mock(/\/sys\/lov\/lov_define\?code=LOV_CODE/, {
    _token: '374d0d9fba56d362e8b70406b9370c06',
    objectVersionNumber: 1,
    code: 'LOV_CODE',
    description: '快码',
    height: 300,
    lovId: 10015,
    lovItems: [{
      _token: 'e09279e3c54846feb32319252396a745',
      objectVersionNumber: 1,
      lovItemId: 10033,
      lovId: 10015,
      display: '代码',
      gridFieldName: 'code',
      gridFieldWidth: 150,
      gridFieldAlign: 'left',
      autocompleteField: 'Y',
      conditionField: 'Y',
      isAutocomplete: 'N',
      gridField: 'Y',
      conditionFieldWidth: null,
      conditionFieldLabelWidth: null,
      conditionFieldType: null,
      conditionFieldName: null,
      conditionFieldTextfield: null,
      conditionFieldNewline: 'N',
      conditionFieldSelectUrl: null,
      conditionFieldSelectVf: null,
      conditionFieldSelectTf: null,
      conditionFieldSelectCode: null,
      conditionFieldLovCode: null,
      conditionFieldSequence: 1,
      gridFieldSequence: 1,
    }, {
      _token: 'cf06481a41189639629b87e0d2ad8674',
      objectVersionNumber: 1,
      lovItemId: 10034,
      lovId: 10015,
      display: '描述',
      gridFieldName: 'description',
      gridFieldWidth: 250,
      gridFieldAlign: 'left',
      autocompleteField: 'Y',
      conditionField: 'Y',
      isAutocomplete: 'N',
      gridField: 'Y',
      conditionFieldWidth: null,
      conditionFieldLabelWidth: null,
      conditionFieldType: null,
      conditionFieldName: null,
      conditionFieldTextfield: null,
      conditionFieldNewline: 'N',
      conditionFieldSelectUrl: null,
      conditionFieldSelectVf: null,
      conditionFieldSelectTf: null,
      conditionFieldSelectCode: null,
      conditionFieldLovCode: null,
      conditionFieldSequence: 2,
      gridFieldSequence: 2,
    }],
    placeholder: '请选择快码',
    sqlId: 'CodeMapper.select',
    customSql: null,
    queryColumns: 1,
    customUrl: null,
    textField: 'description',
    title: '父级快码',
    valueField: 'code',
    width: 500,
    delayLoad: 'N',
    needQueryParam: 'N',
    editableFlag: 'Y',
    canPopup: 'Y',
    lovPageSize: '10',
    treeFlag: 'N',
    idField: null,
    parentIdField: null,
  });
}
