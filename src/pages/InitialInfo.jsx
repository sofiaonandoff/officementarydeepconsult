import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/InitialInfo.css';

const InitialInfo = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [emailError, setEmailError] = useState('');
  const [workStyleOther, setWorkStyleOther] = useState('');

  // 초기 formData 상태
  const initialFormData = {
    companyName: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    spaceSize: '',
    totalEmployees: '',
    budget: '',
    startSchedule: '',
    endSchedule: '',
    seatingType: '',
    workStyle: [],
    workStyleFlexibility: '',
    workstations: {
      count: 0,
      size: '140x70'
    },
    lockers: {
      count: 0
    },
    focusRooms: {
      single: { count: 0, size: '2x2m' },
      double: { count: 0, size: '3x2m' }
    },
    executiveRooms: {
      count: 0,
      size: '4x4m'
    },
    meetingRooms: {
      small: { count: 0, type: 'small' },
      medium: { count: 0, type: 'medium' },
      large: { count: 0, type: 'large' },
      conference: { count: 0, type: 'conference' }
    },
    additionalSpaces: {
      canteen: { required: false, size: '' },
      lounge: { required: false, size: '' },
      breakRoom: { required: false, size: '' },
      storage: { required: false, size: '' },
      exhibition: { required: false, size: '' },
      serverRoom: { required: false, size: '' },
      other: { required: false, size: '' }
    }
  };

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    console.log('Location state:', location.state); // 디버깅용 로그

    if (location.state?.formData) {
      const prevData = location.state.formData;
      console.log('Previous data:', prevData); // 디버깅용 로그

      // 미리보기 페이지에서 돌아왔을 때의 처리
      if (location.state.fromPreview) {
        // 깊은 복사를 통한 데이터 설정
        const newData = JSON.parse(JSON.stringify(prevData));
        console.log('New data:', newData); // 디버깅용 로그
        setFormData(newData);

        // 마지막으로 입력한 단계로 이동
        if (newData.workstations?.count > 0) {
          setStep(3);
        } else if (newData.seatingType) {
          setStep(2);
        } else {
          setStep(1);
        }
      } else {
        // 일반적인 데이터 병합
        const mergedData = {
          ...initialFormData,
          ...prevData,
          workstations: {
            ...initialFormData.workstations,
            ...prevData.workstations
          },
          lockers: {
            ...initialFormData.lockers,
            ...prevData.lockers
          },
          focusRooms: {
            single: {
              ...initialFormData.focusRooms.single,
              ...prevData.focusRooms?.single
            },
            double: {
              ...initialFormData.focusRooms.double,
              ...prevData.focusRooms?.double
            }
          },
          executiveRooms: {
            ...initialFormData.executiveRooms,
            ...prevData.executiveRooms
          },
          meetingRooms: {
            small: {
              ...initialFormData.meetingRooms.small,
              ...prevData.meetingRooms?.small
            },
            medium: {
              ...initialFormData.meetingRooms.medium,
              ...prevData.meetingRooms?.medium
            },
            large: {
              ...initialFormData.meetingRooms.large,
              ...prevData.meetingRooms?.large
            },
            conference: {
              ...initialFormData.meetingRooms.conference,
              ...prevData.meetingRooms?.conference
            }
          },
          additionalSpaces: {
            canteen: {
              ...initialFormData.additionalSpaces.canteen,
              ...prevData.additionalSpaces?.canteen
            },
            lounge: {
              ...initialFormData.additionalSpaces.lounge,
              ...prevData.additionalSpaces?.lounge
            },
            breakRoom: {
              ...initialFormData.additionalSpaces.breakRoom,
              ...prevData.additionalSpaces?.breakRoom
            },
            storage: {
              ...initialFormData.additionalSpaces.storage,
              ...prevData.additionalSpaces?.storage
            },
            exhibition: {
              ...initialFormData.additionalSpaces.exhibition,
              ...prevData.additionalSpaces?.exhibition
            },
            serverRoom: {
              ...initialFormData.additionalSpaces.serverRoom,
              ...prevData.additionalSpaces?.serverRoom
            },
            other: {
              ...initialFormData.additionalSpaces.other,
              ...prevData.additionalSpaces?.other
            }
          }
        };
        console.log('Merged data:', mergedData); // 디버깅용 로그
        setFormData(mergedData);

        // 마지막으로 입력한 단계로 이동
        if (prevData.workstations?.count > 0) {
          setStep(3);
        } else if (prevData.seatingType) {
          setStep(2);
        } else {
          setStep(1);
        }
      }
    }
  }, [location.state]);

  const seatingTypes = [
    { id: 'fixed', label: '고정좌석제', description: '개인별 지정된 자리에서 업무' },
    { id: 'flexible', label: '자율좌석제', description: '자유롭게 자리 선택 가능' }
  ];

  const workStyles = [
    { id: 'startup', label: '스타트업', icon: '🚀' },
    { id: 'finance', label: '재무/금융', icon: '💰' },
    { id: 'tech', label: 'IT/기술', icon: '💻' },
    { id: 'creative', label: '크리에이티브', icon: '🎨' },
    { id: 'consulting', label: '컨설팅', icon: '📊' },
    { id: 'research', label: '연구/개발', icon: '🔬' },
    { id: 'marketing', label: '마케팅', icon: '📈' },
    { id: 'general', label: '일반 사무', icon: '🏢' },
    { id: 'other', label: '기타', icon: '➕' }
  ];

  const flexibilityLevels = [
    { id: 'high', label: '매우 유연', description: '자유로운 공간 활용과 이동' },
    { id: 'medium', label: '중간', description: '일정한 규칙 하에서 유연한 공간 활용' },
    { id: 'low', label: '제한적', description: '정해진 공간에서 업무 수행' }
  ];

  const meetingRoomTypes = [
    { id: 'small', label: '소형 회의실', capacity: '4명' },
    { id: 'medium', label: '중형 회의실', capacity: '6명' },
    { id: 'large', label: '대형 회의실', capacity: '8명' },
    { id: 'conference', label: '컨퍼런스룸', capacity: '9명 이상' }
  ];

  const budgetOptions = [
    { id: 'basic', label: 'Basic', range: '평당 180만원-200만원', minPrice: 180, maxPrice: 200 },
    { id: 'essential', label: 'Essential', range: '평당 200만원-250만원', minPrice: 200, maxPrice: 250 },
    { id: 'premium', label: 'Premium', range: '평당 250만원-300만원', minPrice: 250, maxPrice: 300 },
    { id: 'signature', label: 'Signature', range: '평당 300만원 이상', minPrice: 300, maxPrice: null }
  ];

  const formatCurrency = (amount) => {
    if (amount >= 10000) {
      const billions = Math.floor(amount / 10000);
      const millions = amount % 10000;
      if (millions === 0) {
        return `${billions}억원`;
      }
      return `${billions}억 ${millions}만원`;
    }
    return `${amount}만원`;
  };

  const calculateEstimatedBudget = () => {
    if (!formData.spaceSize || !formData.budget) return null;

    const selectedBudget = budgetOptions.find(option => option.id === formData.budget);
    if (!selectedBudget) return null;

    const minTotal = formData.spaceSize * selectedBudget.minPrice;
    const maxTotal = selectedBudget.maxPrice
      ? formData.spaceSize * selectedBudget.maxPrice
      : null;

    return {
      min: formatCurrency(minTotal),
      max: maxTotal ? formatCurrency(maxTotal) : `${formatCurrency(minTotal)} 이상`
    };
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'contactEmail') {
      if (!value) {
        setEmailError('');
      } else if (!validateEmail(value)) {
        setEmailError('올바른 이메일 형식이 아닙니다');
      } else {
        setEmailError('');
      }
    }
  };

  const handleWorkstationChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      workstations: {
        ...prev.workstations,
        [name]: value
      }
    }));
  };

  const handleMeetingRoomCountChange = (type, value) => {
    setFormData(prev => ({
      ...prev,
      meetingRooms: {
        ...prev.meetingRooms,
        [type]: {
          ...prev.meetingRooms[type],
          count: parseInt(value) || 0
        }
      }
    }));
  };

  const handleMeetingRoomAdd = (type) => {
    setFormData(prev => ({
      ...prev,
      meetingRooms: {
        ...prev.meetingRooms,
        [type]: {
          ...prev.meetingRooms[type],
          count: prev.meetingRooms[type].count + 1
        }
      }
    }));
  };

  const handleMeetingRoomRemove = (type) => {
    setFormData(prev => ({
      ...prev,
      meetingRooms: {
        ...prev.meetingRooms,
        [type]: {
          ...prev.meetingRooms[type],
          count: Math.max(0, prev.meetingRooms[type].count - 1)
        }
      }
    }));
  };

  const handleAdditionalSpaceToggle = (spaceType) => {
    setFormData(prev => ({
      ...prev,
      additionalSpaces: {
        ...prev.additionalSpaces,
        [spaceType]: {
          ...prev.additionalSpaces[spaceType],
          required: !prev.additionalSpaces[spaceType].required
        }
      }
    }));
  };

  const handleAdditionalSpaceSizeChange = (spaceType, value) => {
    setFormData(prev => ({
      ...prev,
      additionalSpaces: {
        ...prev.additionalSpaces,
        [spaceType]: {
          ...prev.additionalSpaces[spaceType],
          size: value
        }
      }
    }));
  };

  const handlePhoneRoomCountChange = (value) => {
    setFormData(prev => ({
      ...prev,
      phoneRooms: {
        ...prev.phoneRooms,
        count: parseInt(value) || 0
      }
    }));
  };

  const handleFocusRoomCountChange = (type, value) => {
    setFormData(prev => ({
      ...prev,
      focusRooms: {
        ...prev.focusRooms,
        [type]: {
          ...prev.focusRooms[type],
          count: parseInt(value) || 0
        }
      }
    }));
  };

  const handleExecutiveRoomCountChange = (value) => {
    setFormData(prev => ({
      ...prev,
      executiveRooms: {
        ...prev.executiveRooms,
        count: parseInt(value) || 0
      }
    }));
  };

  const handleWorkStyleChange = (id) => {
    setFormData(prev => {
      const exists = prev.workStyle.includes(id);
      let newWorkStyle = exists
        ? prev.workStyle.filter(styleId => styleId !== id)
        : [...prev.workStyle, id];
      // 기타 해제 시 입력값도 초기화
      if (id === 'other' && exists) setWorkStyleOther('');
      return {
        ...prev,
        workStyle: newWorkStyle
      };
    });
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // 다음 단계로 이동
      const mergedFormData = {
        ...formData,
        workStyleOther
      };
      navigate('/design-preview', { state: { formData: mergedFormData } });
    }
  };

  const handleSkip = () => {
    if (step === 2 || step === 3) {
      if (step === 2) {
        setStep(3);
      } else {
        // 다음 단계로 이동
        const mergedFormData = {
          ...formData,
          workStyleOther
        };
        navigate('/design-preview', { state: { formData: mergedFormData } });
      }
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="step-container">
            <h2>기본 정보 입력</h2>
            <div className="input-group">
              <div className="input-field">
                <label>회사 이름 <span className="required">*</span></label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  placeholder="회사명을 입력하세요"
                />
              </div>
              <div className="contact-info">
                <div className="input-field">
                  <label>담당자 이름 <span className="required">*</span></label>
                  <input
                    type="text"
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleInputChange}
                    placeholder="담당자 이름을 입력하세요"
                  />
                </div>
                <div className="input-field">
                  <label>연락처 <span className="required">*</span></label>
                  <input
                    type="tel"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleInputChange}
                    placeholder="연락처를 입력하세요"
                  />
                </div>
              </div>
              <div className="input-field">
                <label>이메일 <span className="required">*</span></label>
                <input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleInputChange}
                  placeholder="이메일을 입력하세요"
                />
                {emailError && <span className="error-message">{emailError}</span>}
              </div>
              <div className="input-field">
                <label>오피스 공간 크기</label>
                <div className="size-input">
                  <input
                    type="number"
                    name="spaceSize"
                    value={formData.spaceSize}
                    onChange={handleInputChange}
                    placeholder="평수 입력"
                    min="1"
                  />
                  <span className="unit">평</span>
                </div>
              </div>
              <div className="input-field">
                <label>오피스 총 인원</label>
                <div className="size-input">
                  <input
                    type="number"
                    name="totalEmployees"
                    value={formData.totalEmployees}
                    onChange={handleInputChange}
                    placeholder="인원 수 입력"
                    min="1"
                  />
                  <span className="unit">명</span>
                </div>
              </div>
              <div className="input-field">
                <label>예산 범위</label>
                <div className="budget-options">
                  {budgetOptions.map((option) => (
                    <button
                      key={option.id}
                      className={`budget-option ${formData.budget === option.id ? 'selected' : ''}`}
                      onClick={() => handleInputChange({ target: { name: 'budget', value: option.id } })}
                    >
                      <h4>{option.label}</h4>
                      <p>{option.range}</p>
                    </button>
                  ))}
                </div>
                {formData.spaceSize && formData.budget && (
                  <div className="estimated-budget">
                    <p>예상 총 예산: {
                      formData.budget === 'signature'
                        ? calculateEstimatedBudget().max
                        : `${calculateEstimatedBudget().min} ~ ${calculateEstimatedBudget().max}`
                    }</p>
                  </div>
                )}
              </div>
              <div className="schedule-inputs">
                <div className="input-field">
                  <label>시작 일정</label>
                  <div className="schedule-input">
                    <input
                      type="date"
                      name="startSchedule"
                      value={formData.startSchedule}
                      onChange={handleInputChange}
                      min={new Date().toISOString().slice(0, 10)}
                      placeholder="시작 일자 선택"
                      className="styled-date-input"
                    />
                  </div>
                </div>
                <div className="input-field">
                  <label>공사 완료 일정</label>
                  <div className="schedule-input">
                    <input
                      type="date"
                      name="endSchedule"
                      value={formData.endSchedule}
                      onChange={handleInputChange}
                      min={formData.startSchedule ? formData.startSchedule : new Date().toISOString().slice(0, 10)}
                      placeholder="완료 일자 선택"
                      className="styled-date-input"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="step-container">
            <h2>업무 공간 설정</h2>
            <div className="space-settings">
              <div className="setting-section">
                <h3>업무 형태 선택</h3>
                <div className="work-style-options">
                  {workStyles.map((style) => {
                    const checked = formData.workStyle.includes(style.id);
                    return (
                      <label
                        key={style.id}
                        className={`work-style-checkbox work-style-btn${checked ? ' selected' : ''}`}
                        style={{ display: 'inline-block', margin: '0 8px 8px 0', cursor: 'pointer', border: checked ? '2px solid #007bff' : '1px solid #ccc', borderRadius: '8px', padding: '10px 16px', background: checked ? '#e6f0ff' : '#fff', transition: 'all 0.2s' }}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => handleWorkStyleChange(style.id)}
                          style={{ display: 'none' }}
                        />
                        <span className="icon" style={{ marginRight: 6 }}>{style.icon}</span>
                        {style.label}
                        {style.id === 'other' && checked && (
                          <input
                            type="text"
                            value={workStyleOther}
                            onChange={e => setWorkStyleOther(e.target.value)}
                            placeholder="기타 업무 형태 입력"
                            style={{ marginLeft: 8, padding: '2px 6px', borderRadius: 4, border: '1px solid #ccc', width: 120 }}
                          />
                        )}
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="setting-section">
                <h3>좌석제도 선택</h3>
                <div className="seating-options">
                  {seatingTypes.map((type) => (
                    <button
                      key={type.id}
                      className={`seating-option ${formData.seatingType === type.id ? 'selected' : ''}`}
                      onClick={() => handleInputChange({ target: { name: 'seatingType', value: type.id } })}
                    >
                      <h4>{type.label}</h4>
                      <p>{type.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="setting-section">
                <h3>업무 공간 유연성</h3>
                <div className="flexibility-options">
                  {flexibilityLevels.map((level) => (
                    <button
                      key={level.id}
                      className={`flexibility-option ${formData.workStyleFlexibility === level.id ? 'selected' : ''}`}
                      onClick={() => handleInputChange({ target: { name: 'workStyleFlexibility', value: level.id } })}
                    >
                      <h4>{level.label}</h4>
                      <p>{level.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="step-container">
            <h2>상세 공간 요구사항</h2>
            <div className="space-requirements">
              <div className="requirement-section">
                <h3>개인 업무공간</h3>
                <div className="workstation-inputs">
                  <div className="input-field">
                    <label>워크스테이션</label>
                    <div className="count-input">
                      <input
                        type="number"
                        name="count"
                        value={formData.workstations.count}
                        onChange={handleWorkstationChange}
                        min="1"
                        placeholder="워크스테이션 개수"
                      />
                    </div>
                  </div>
                  <div className="input-field">
                    <label>크기 (cm)</label>
                    <select
                      name="size"
                      value={formData.workstations.size}
                      onChange={handleWorkstationChange}
                    >
                      <option value="140x70">140 x 70</option>
                      <option value="150x70">150 x 70</option>
                      <option value="160x70">160 x 70</option>
                    </select>
                  </div>
                  <div className="input-field">
                    <label>개인 락커</label>
                    <div className="count-input">
                      <input
                        type="number"
                        name="count"
                        value={formData.lockers.count}
                        onChange={(e) => handleInputChange({ target: { name: 'lockers', value: { count: e.target.value } } })}
                        min="0"
                        placeholder="락커 개수"
                      />
                    </div>
                  </div>
                </div>
                <div className="oa-space-info">
                  <p>OA 공간은 워크스테이션 수와 공간 크기에 맞춰 적정한 공간을 마련합니다.</p>
                  <p>워크스테이션 간 통로, 프린터 공간, 서류 보관 공간 등이 포함됩니다.</p>
                </div>
                <div className="personal-space-inputs">
                  <div className="space-count-input">
                    <label>1인 포커스룸</label>
                    <div className="count-controls">
                      <button
                        className="count-button"
                        onClick={() => handleFocusRoomCountChange('single', Math.max(0, formData.focusRooms.single.count - 1))}
                      >
                        -
                      </button>
                      <span className="count">{formData.focusRooms.single.count}</span>
                      <button
                        className="count-button"
                        onClick={() => handleFocusRoomCountChange('single', formData.focusRooms.single.count + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="space-count-input">
                    <label>2인 포커스룸</label>
                    <div className="count-controls">
                      <button
                        className="count-button"
                        onClick={() => handleFocusRoomCountChange('double', Math.max(0, formData.focusRooms.double.count - 1))}
                      >
                        -
                      </button>
                      <span className="count">{formData.focusRooms.double.count}</span>
                      <button
                        className="count-button"
                        onClick={() => handleFocusRoomCountChange('double', formData.focusRooms.double.count + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="space-count-input">
                    <label>임원실(사무실)</label>
                    <div className="count-controls">
                      <button
                        className="count-button"
                        onClick={() => handleExecutiveRoomCountChange(Math.max(0, formData.executiveRooms.count - 1))}
                      >
                        -
                      </button>
                      <span className="count">{formData.executiveRooms.count}</span>
                      <button
                        className="count-button"
                        onClick={() => handleExecutiveRoomCountChange(formData.executiveRooms.count + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="requirement-section">
                <h3>회의실</h3>
                <div className="meeting-room-options">
                  {meetingRoomTypes.map((type) => (
                    <div key={type.id} className="meeting-room-type">
                      <div className="meeting-room-info">
                        <h4>{type.label}</h4>
                        <p>수용 인원: {type.capacity}</p>
                      </div>
                      <div className="meeting-room-count">
                        <button
                          className="count-button"
                          onClick={() => handleMeetingRoomCountChange(type.id, Math.max(0, formData.meetingRooms[type.id].count - 1))}
                        >
                          -
                        </button>
                        <span className="count">{formData.meetingRooms[type.id].count}</span>
                        <button
                          className="count-button"
                          onClick={() => handleMeetingRoomCountChange(type.id, formData.meetingRooms[type.id].count + 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="requirement-section">
                <h3>추가 공간</h3>
                <div className="additional-spaces">
                  <div className="space-option">
                    <label>
                      <input
                        type="checkbox"
                        checked={formData.additionalSpaces.canteen.required}
                        onChange={() => handleAdditionalSpaceToggle('canteen')}
                      />
                      캔틴
                    </label>
                    {formData.additionalSpaces.canteen.required && (
                      <input
                        type="text"
                        placeholder="캔틴 크기 (예: 5x5m)"
                        value={formData.additionalSpaces.canteen.size}
                        onChange={(e) => handleAdditionalSpaceSizeChange('canteen', e.target.value)}
                      />
                    )}
                  </div>
                  <div className="space-option">
                    <label>
                      <input
                        type="checkbox"
                        checked={formData.additionalSpaces.lounge.required}
                        onChange={() => handleAdditionalSpaceToggle('lounge')}
                      />
                      라운지
                    </label>
                    {formData.additionalSpaces.lounge.required && (
                      <input
                        type="text"
                        placeholder="라운지 크기 (예: 4x4m)"
                        value={formData.additionalSpaces.lounge.size}
                        onChange={(e) => handleAdditionalSpaceSizeChange('lounge', e.target.value)}
                      />
                    )}
                  </div>
                  <div className="space-option">
                    <label>
                      <input
                        type="checkbox"
                        checked={formData.additionalSpaces.breakRoom.required}
                        onChange={() => handleAdditionalSpaceToggle('breakRoom')}
                      />
                      휴게실
                    </label>
                    {formData.additionalSpaces.breakRoom.required && (
                      <input
                        type="text"
                        placeholder="휴게실 크기 (예: 4x4m)"
                        value={formData.additionalSpaces.breakRoom.size}
                        onChange={(e) => handleAdditionalSpaceSizeChange('breakRoom', e.target.value)}
                      />
                    )}
                  </div>
                  <div className="space-option">
                    <label>
                      <input
                        type="checkbox"
                        checked={formData.additionalSpaces.storage.required}
                        onChange={() => handleAdditionalSpaceToggle('storage')}
                      />
                      창고
                    </label>
                    {formData.additionalSpaces.storage.required && (
                      <input
                        type="text"
                        placeholder="창고 크기 (예: 3x3m)"
                        value={formData.additionalSpaces.storage.size}
                        onChange={(e) => handleAdditionalSpaceSizeChange('storage', e.target.value)}
                      />
                    )}
                  </div>
                  <div className="space-option">
                    <label>
                      <input
                        type="checkbox"
                        checked={formData.additionalSpaces.exhibition.required}
                        onChange={() => handleAdditionalSpaceToggle('exhibition')}
                      />
                      전시공간
                    </label>
                    {formData.additionalSpaces.exhibition.required && (
                      <input
                        type="text"
                        placeholder="전시공간 크기 (예: 6x6m)"
                        value={formData.additionalSpaces.exhibition.size}
                        onChange={(e) => handleAdditionalSpaceSizeChange('exhibition', e.target.value)}
                      />
                    )}
                  </div>
                  <div className="space-option">
                    <label>
                      <input
                        type="checkbox"
                        checked={formData.additionalSpaces.serverRoom.required}
                        onChange={() => handleAdditionalSpaceToggle('serverRoom')}
                      />
                      서버실
                    </label>
                    {formData.additionalSpaces.serverRoom.required && (
                      <input
                        type="text"
                        placeholder="서버실 크기 (예: 4x4m)"
                        value={formData.additionalSpaces.serverRoom.size}
                        onChange={(e) => handleAdditionalSpaceSizeChange('serverRoom', e.target.value)}
                      />
                    )}
                  </div>
                  <div className="space-option">
                    <label>
                      <input
                        type="checkbox"
                        checked={formData.additionalSpaces.other.required}
                        onChange={() => handleAdditionalSpaceToggle('other')}
                      />
                      기타
                    </label>
                    {formData.additionalSpaces.other.required && (
                      <input
                        type="text"
                        placeholder="공간 용도와 크기 입력"
                        value={formData.additionalSpaces.other.size}
                        onChange={(e) => handleAdditionalSpaceSizeChange('other', e.target.value)}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="initial-info-container">
      <div className="progress-bar">
        <div className="progress" style={{ width: `${(step / 3) * 100}%` }} />
      </div>
      {renderStep()}
      <div className="navigation-buttons">
        {step > 1 && (
          <button className="back-button" onClick={() => setStep(step - 1)}>
            이전
          </button>
        )}
        {(step === 2 || step === 3) && (
          <button className="skip-button" onClick={handleSkip}>
            SKIP
          </button>
        )}
        <button
          className="next-button"
          onClick={handleNext}
          disabled={
            (step === 1 && (!formData.companyName || !formData.contactName ||
              !formData.contactPhone || !formData.contactEmail ||
              emailError || !validateEmail(formData.contactEmail))) ||
            (step === 2 && (!formData.seatingType || formData.workStyle.length === 0 || !formData.workStyleFlexibility))
          }
        >
          {step === 3 ? '댜음' : '다음'}
        </button>
      </div>
    </div>
  );
};

export default InitialInfo; 