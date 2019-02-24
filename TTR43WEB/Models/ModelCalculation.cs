using System;
using System.Collections.Generic;
using System.Linq;
using System.Collections.ObjectModel;

namespace TTR43WEB.Models
{

    delegate void MyEventHandler();
    /// <summary>
    /// ТКП 45-2.04-43-2006* (02250) СТРОИТЕЛЬНАЯ ТЕПЛОТЕХНИКА
    /// </summary>
    public class ModelCalculation
    {
        event MyEventHandler SomeEvent;

        public void Determinate()
        {
            SomeEvent();
        }

        #region DATA

        /// <summary>
        /// ID материала согласно таблице Приложения А
        /// </summary>
        public List<string> IDInTable { set; get; } = new List<string>();

        /// <summary>
        /// Название материала согласно таблице Приложения А
        /// </summary>
        public List<string> MaterialLayerName { set; get; } = new List<string>();

        /// <summary>
        /// ID материала согласно базе данных
        /// </summary>
        public List<int> ID { set; get; } = new List<int>();

        ///<summary>
        /// Плотность p, кг/м³
        ///</summary>
        public List<double> MaterialLayerDensity { get; set; } = new List<double>();

        ///<summary>
        /// δ толщина одного слоя, м;
        ///</summary>
        public List<double> MaterialLayerThickness { get; set; } = new List<double>();
        //Временное хранилище толщины конкретного материала
        public double MaterialLayerThicknessTemp { get => _materialLayerThicknessTemp; set => _materialLayerThicknessTemp = value; }

        ///<summary>
        ///расчетный коэффициент теплопроводности материала слоя конструкции, Вт/(м∙°С), в условиях эксплуатации согласно таблице 4.2; принимают по приложению А.
        ///</summary>
        public List<double> MaterialThermalConductivityServiceA { get; set; } = new List<double>();
        public List<double> MaterialThermalConductivityServiceB { get; set; } = new List<double>();
        private List<double> _materialThermalConductivity()
        {
            return this.ServiceConditionsOut == _serviceConditions[0] ? this.MaterialThermalConductivityServiceA : this.MaterialThermalConductivityServiceB;
        }

        /// <summary>
        /// расчетный коэффициент теплоусвоения материала отдельных слоев ограждающей конструкции в условиях эксплуатации по таблице 4.2, Вт/(м²∙°С), принимаемый по приложению А.
        /// </summary>
        public List<double> MaterialHeatBuildUpServiceA { get; set; } = new List<double>();
        public List<double> MaterialHeatBuildUpServiceB { get; set; } = new List<double>();
        private List<double> _materialHeatBuildUp()
        {
            return this.ServiceConditionsOut == _serviceConditions[0] ? this.MaterialHeatBuildUpServiceA : this.MaterialHeatBuildUpServiceB;
        }

        ///<summary>
        /// Термическое сопротивление замкнутой воздушной прослойки, (м∙°С)/Вт
        ///</summary>
        public List<double> ThermalResistanceAir { get; set; } = new List<double>();

        ///<summary>
        /// Толщина воздушной прослойки, м
        ///</summary>
        public List<double> MaterialAirLayerThickness { get; set; } = new List<double>();
        ///<summary>
        /// Направление воздушной прослойки, м
        ///</summary>
        public List<string> MaterialAirLayerDirection { get; set; } = new List<string>();

        #endregion

        /// <summary>
        /// Конструктор по умолчанию
        /// </summary>
		public ModelCalculation()
        {
            //подписываем событие для расчета данных и вывода результата
            this.SomeEvent += this.OperatingConditionsOfEnclosingStructuresResolve;
            this.SomeEvent += this.ThermalResistanceRkResolve;
            this.SomeEvent += this.ThermalInertiaEnclosingStructureResolve;
            this.SomeEvent += this.ThermalResistanceR0Resolve;
            this.SomeEvent += this.ThermalResistanceRprResolve;
            this.SomeEvent += this.ThermalResistanceRequiredResolve;
            this.SomeEvent += this.PrintResultConsole;

        }

        /// <summary>
        /// Описание добавленного материала
        /// </summary>
        public string MaterialAddResult { get; set; }
        private ObservableCollection<string> _materialAddResultAttachmentA { get; set; } = new ObservableCollection<string>();
        public ObservableCollection<string> MaterialAddResultAttachmentA
        {
            get
            {
                return this._materialAddResultAttachmentA;
            }
            set
            {
                _materialAddResultAttachmentA = value;
                //_materialAddResultAttachmentA.CollectionChanged += ListBoxMaterialAdd_MouseDoubleClick;
            }
        }
        private ObservableCollection<string> _materialAddResultAttachmentB { get; set; } = new ObservableCollection<string>();
        public ObservableCollection<string> MaterialAddResultAttachmentB
        {
            get
            {
                return this._materialAddResultAttachmentB;
            }
            set
            {
                _materialAddResultAttachmentB = value;
                //_materialAddResultAttachmentA.CollectionChanged += ListBoxMaterialAdd_MouseDoubleClick;
            }
        }

        /// <summary>
        /// Метод для добавления слоев материалов из таблицы Приложения А, в ListBox с сохранением данных
        /// </summary>
        public void MaterialAdd(int ID, string NUMBER, string MATERIAL, double P, double materialLayerThicknessTemp, double REAL_LJA_A, double REAL_S_A, double REAL_LJA_B, double REAL_S_B)
        {

            this.ID.Add(ID);
            this.IDInTable.Add(NUMBER);
            this.MaterialLayerName.Add(Convert.ToString(MATERIAL));

            this.MaterialLayerDensity.Add(Convert.ToDouble(P));
            this.MaterialLayerThickness.Add(Convert.ToDouble(materialLayerThicknessTemp));

            this.MaterialThermalConductivityServiceA.Add(Convert.ToDouble(REAL_LJA_A));
            this.MaterialHeatBuildUpServiceA.Add(Convert.ToDouble(REAL_S_A));
            this.MaterialThermalConductivityServiceB.Add(Convert.ToDouble(REAL_LJA_B));
            this.MaterialHeatBuildUpServiceB.Add(Convert.ToDouble(REAL_S_B));

            this._materialAddResultAttachmentA.Add(
                "№" + this.IDInTable.Last().ToString() +
                " " + this.MaterialLayerName.Last().ToString() +
                ", p = " + this.MaterialLayerDensity.Last().ToString() + " кг/м³" +
                ", δ = " + this.MaterialLayerThickness.Last().ToString() + " м" +
                ", λ(А) = " + this.MaterialThermalConductivityServiceA.Last().ToString() + " Вт/(м∙°С)" +
                ", λ(Б) = " + this.MaterialThermalConductivityServiceB.Last().ToString() + " Вт/(м∙°С)" +
                ", S(А) = " + this.MaterialHeatBuildUpServiceA.Last().ToString() + " Вт/(м²∙°С)" +
                ", S(Б) = " + this.MaterialHeatBuildUpServiceB.Last().ToString() + " Вт/(м²∙°С);");
        }

        /// <summary>
        /// Удалить выделенный слой ограждающей конструкции
        /// </summary>
        /// <param name="i"></param>
        public void MaterialRemoveAt(int i)
        {
            try
            {
                this.IDInTable.RemoveAt(i);
                this.ID.RemoveAt(i);
                this.MaterialLayerName.RemoveAt(i);
                this.MaterialLayerDensity.RemoveAt(i);
                this.MaterialLayerThickness.RemoveAt(i);
                this.MaterialHeatBuildUpServiceA.RemoveAt(i);
                this.MaterialThermalConductivityServiceA.RemoveAt(i);
                this.MaterialThermalConductivityServiceB.RemoveAt(i);
                this._materialAddResultAttachmentA.RemoveAt(i);
            }
            catch (ArgumentOutOfRangeException ex)
            {
                //MessageBox.Show(ex.Message.ToString(), ex.TargetSite.ToString(), MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }
        /// <summary>
        /// Удалить выделенный слой воздуха
        /// </summary>
        /// <param name="i"></param>
        public void MaterialAirRemoveAt(int i)
        {
            try
            {
                this.ThermalResistanceAir.RemoveAt(i);
                this.MaterialAirLayerThickness.RemoveAt(i);
                this.MaterialAirLayerDirection.RemoveAt(i);
                this._materialAddResultAttachmentB.RemoveAt(i);
            }
            catch (ArgumentOutOfRangeException ex)
            {
                //MessageBox.Show(ex.Message.ToString(), ex.TargetSite.ToString(), MessageBoxButton.OK, MessageBoxImage.Error);
                throw ex;
            }
        }

        /// <summary>
        /// Очистка всех коллекций
        /// </summary>
        public void MaterialRemoveAll()
        {
            this.IDInTable.Clear();
            this.ID.Clear();
            this.MaterialLayerName.Clear();
            this.MaterialLayerDensity.Clear();
            this.MaterialLayerThickness.Clear();
            this.MaterialHeatBuildUpServiceA.Clear();
            this.MaterialThermalConductivityServiceA.Clear();
            this.MaterialThermalConductivityServiceB.Clear();
            this._materialAddResultAttachmentA.Clear();
        }

        #region Таблица 4.4
        /// <summary>
        /// Область
        /// </summary>
        public string Region { set; get; }
        /// <summary>
        /// Данные для среднесуточной температуры наружного воздуха начала отопительного периода, °С
        /// </summary>
        public int AverageDailyOutsideTemperature { set; get; }
        /// <summary>
        /// Средняя температура наружного воздуха tн, °С
        /// </summary>
        public double AverageOutsideTemperature { set; get; }
        /// <summary>
        /// Средняя относительная влажность наружного воздуха φн, %
        /// </summary>
        public int AverageRelativeHumidity { set; get; }
        /// <summary>
        /// Среднее парциальное давление водяного пара ен, Па
        /// </summary>
        public int AveragePartialPressure { set; get; }
        /// <summary>
        /// Продолжительность отопительного периода Zот, сут
        /// </summary>
        public int DurationHeatingSeason { set; get; }
        #endregion


        /// <summary>
        /// n — коэффициент, учитывающий положение наружной поверхности ограждающей конструкции по отношению к наружному воздуху, принимаемый по таблице 5.3
        /// </summary>
        public double COEFFICIENT_N { set; get; }

        /// <summary>
        /// ∆tв — расчетный перепад между температурой внутреннего воздуха и температурой внутренней поверхности ограждающей конструкции, °С, принимаемый по таблице 5.5.
        /// </summary>
        public double TemperatureDifference { set; get; }

        /// <summary>
        /// tн — расчетная зимняя температура наружного воздуха, °С, принимаемая по таблице 4.3 [1] 
        /// с учетом тепловой инерции ограждающих конструкций D (за исключением заполнений проемов) по таблице 5.2 [1]
        /// </summary>
        public double TemperatureOutsideAir { set; get; }

        /// <summary>
        /// Общая толщина конструкции, м
        /// </summary>
        public double ConstructThickness { set; get; }

        /// коэффициент теплоотдачи внутренней поверхности ограждающей конструкции αв, Вт/(м²∙°С), принимаемый по таблице 5.4;
        public double HeatTransferInternal { get; set; }

        /// коэффициент теплоотдачи наружной поверхности ограждающей конструкции для зимних условий αн, Вт/(м²∙°С) принимаемый по таблице 5.7
        public int HeatTransferOuter { get; set; }

        /// <summary>
        /// Тепловая инерция ограждающей конструкции D следует определять по формуле (5.4)
        /// </summary>
        public double Inertia { get; set; }

        /// <summary>
        /// Расчетный период для определения tн (зимняя температура наружного воздуха) с учетом (Тепловая инерция ограждающей конструкции D)
        /// </summary>
        public int EstimatedPeriod { get; private set; }
        public readonly string[] EstimatedPeriodName = new string[] {
                "Наиболее холодные сутки обеспеченностью 0,98",
                "Наиболее холодные сутки обеспеченностью 0,92",
                "Наиболее холодная пятидневка обеспеченностью 0,92",
                "Средняя температура наиболее холодных трех суток"};

        /// <summary>
        /// Тепловую инерцию ограждающей конструкции D следует определять по формуле, (5.4)
        /// </summary>
        /// <returns>D</returns>
        public void ThermalInertiaEnclosingStructureResolve()
        {
            if (this.Inertia <= 1.5)
            {
                this.EstimatedPeriod = 0;
            }
            else if (this.Inertia > 1.5 && this.Inertia <= 4.0)
            {
                this.EstimatedPeriod = 1;
            }
            else if (this.Inertia > 4.0 && this.Inertia <= 7.0)
            {
                this.EstimatedPeriod = 2;
            }
            else if (this.Inertia > 7.0)
            {
                this.EstimatedPeriod = 3;
            }
        }

        /// <summary>
        /// Термическое сопротивление однородной ограждающей конструкции, а также слоя многослойной конструкции R, м²∙°С/Вт
        /// </summary>
        /// <returns></returns>
        double InertiaLayer(double layerThickness, double thermalConductivityMaterial, double materialHeatBuildUp)
        {
            return layerThickness / thermalConductivityMaterial * materialHeatBuildUp;
        }

        /// <summary>
        /// Термическое сопротивление однородной ограждающей конструкции, а также слоя многослойной конструкции R, м²∙°С/Вт
        /// </summary>
        /// <returns></returns>
        double ThermalResistanceLayer(double layerThickness, double thermalConductivityMaterial)
        {
            return layerThickness / thermalConductivityMaterial;
        }

        /// <summary>
        /// Rк — термическое сопротивление, м²∙°С/Вт, однослойной теплотехнически однородной ограждающей конструкции, определяемое по формуле (5.5), 
        /// или многослойной теплотехнически однородной ограждающей конструкции — определяемое по формуле (5.7);
        /// </summary>
        public double ThermalResistanceRk { get; set; }

        /// <summary>
        /// Расчет Rк
        /// Расчет Inertia
        /// Расчет ConstructThickness
        /// </summary>
        public void ThermalResistanceRkResolve()
        {
            this.Inertia = 0.0;
            this.ThermalResistanceRk = 0.0;
            this.ConstructThickness = 0;

            for (int i = 0; i < MaterialLayerThickness.Count; i++)
            {
                this.ThermalResistanceRk += this.ThermalResistanceLayer(this.MaterialLayerThickness.ElementAt(i), this._materialThermalConductivity().ElementAt(i));
                this.Inertia += this.InertiaLayer(this.MaterialLayerThickness.ElementAt(i), this._materialThermalConductivity().ElementAt(i), this._materialHeatBuildUp().ElementAt(i));
                this.ConstructThickness += this.MaterialLayerThickness[i];
            }

            if (ThermalResistanceAir.Count > 0 && MaterialAirLayerThickness.Count == ThermalResistanceAir.Count)
            {
                for (int i = 0; i < this.ThermalResistanceAir.Count; i++)
                {
                    this.ThermalResistanceRk += ThermalResistanceAir.ElementAt(i);
                    this.ConstructThickness += this.MaterialAirLayerThickness[i];
                }
            }

            this.ThermalResistanceRk = Math.Round(this.ThermalResistanceRk, 3, MidpointRounding.AwayFromZero);
            this.Inertia = Math.Round(this.Inertia, 3, MidpointRounding.AwayFromZero);
            this.ThermalResistanceR0 = Math.Round(this.ThermalResistanceR0, 3, MidpointRounding.AwayFromZero);
        }

        /// <summary>
        /// Печать формулы Rk
        /// </summary>
        /// <returns></returns>
        public string PrintRk()
        {
            string a = "";
            for (int i = 0; i < this.MaterialLayerThickness.Count; i++)
            {
                a += this.MaterialLayerThickness.ElementAt(i) + "/" + _materialThermalConductivity().ElementAt(i) + "+";
            }
            a = a.TrimEnd('+');
            if (ThermalResistanceAir.Count > 0 && MaterialAirLayerThickness.Count > 0)
            {
                a += "+";
                for (int i = 0; i < this.ThermalResistanceAir.Count; i++)
                {
                    a += ThermalResistanceAir.ElementAt(i).ToString() + "+";
                }
                a = a.TrimEnd('+');
            }
            return a;
        }
        /// <summary>
        /// Печать формулы D
        /// </summary>
        /// <returns></returns>
        public string PrintD()
        {
            string D = "";
            for (int i = 0; i < this.MaterialLayerThickness.Count; i++)
            {
                D += this.MaterialLayerThickness.ElementAt(i) + "/" + _materialThermalConductivity().ElementAt(i) + "∙" + _materialHeatBuildUp().ElementAt(i) + "+";
            }
            D = D.TrimEnd('+');
            if (ThermalResistanceAir.Count > 0 && MaterialAirLayerThickness.Count > 0)
            {
                D += "+";
                for (int i = 0; i < this.ThermalResistanceAir.Count; i++)
                {
                    D += ThermalResistanceAir.ElementAt(i).ToString() + "∙0+";
                }
                D = D.TrimEnd('+');
            }
            return D;
        }

        /// <summary>
        /// Метод для расчета толщины утеплителя
        /// </summary>
        /// <param name="MaterialThermalConductivity">расчетный коэффициент теплопроводности материала слоя конструкции, Вт/(м∙°С), в условиях эксплуатации согласно таблице 4.2; принимают по приложению А.</param>
        /// <returns></returns>
        public double ThicknessLayerResolve(double materialThermalConductivityServiceA, double materialThermalConductivityServiceB, out double _materialThermalConductivity)
        {
            double MaterialThermalConductivity = this.ServiceConditionsOut == _serviceConditions[0] ? materialThermalConductivityServiceA : materialThermalConductivityServiceB;
            _materialThermalConductivity = MaterialThermalConductivity;
            this.ThermalResistanceR0Resolve();
            return Math.Round((this.ThermalResistanceNormative - this.ThermalResistanceRpr) * MaterialThermalConductivity, 3);
        }

        /// <summary>
        /// приведенное сопротивление теплопередаче теплотехнически однородной ограждающей конструкции R0, м²∙°С/Вт определяют по формулам (5.6), (5.7)
        /// </summary>
        public double ThermalResistanceR0 { get; set; }

        ///<summary>
        /// Приведенное сопротивление теплопередаче теплотехнически однородной ограждающей конструкции R0, м²∙°С/Вт определяют по формулам (5.6), (5.7)
        ///</summary>
        ///<remarks>сопротивление теплопередаче</remarks>
        ///<returns>приведенное сопротивление теплопередаче</returns>
        public void ThermalResistanceR0Resolve()
        {
            this.ThermalResistanceR0 = Math.Round(1.0 / this.HeatTransferInternal + this.ThermalResistanceRk + 1.0 / this.HeatTransferOuter, 3, MidpointRounding.AwayFromZero);
        }

        ///<summary>
        ///Нормативное сопротивление теплопередаче R т.норм, м²∙°С/Вт приведенного в таблице 5.1.
        ///</summary>
        public double ThermalResistanceNormative
        {
            get => _thermalResistanceNormative;
            set
            {
                try
                {
                    _thermalResistanceNormative = value;
                }
                catch (Exception ex)
                {
                    //MessageBox.Show(ex.Message.ToString(), ex.TargetSite.ToString(), MessageBoxButton.OK, MessageBoxImage.Error);
                }
            }
        }

        ///<summary>
        ///Нормативное сопротивление теплопередаче R т.норм, м²∙°С/Вт приведенного в таблице 5.1.
        ///</summary>
        public string ThermalResistanceNormativeCALCULATION_TYPE { get; set; }

        /// <summary>
        /// r — расчетный коэффициент, учитывающий нарушения теплотехнической однородности ограждающей конструкции(далее — коэффициент теплотехнической однородности);
        /// </summary>
        public double COEFFICIENT_r { get => _cOEFFICIENT_r; set => _cOEFFICIENT_r = value; }

        /// <summary>
        /// Значение приведенного сопротивления теплопередаче плоских ограждающих конструкций (или их участков) Rпр, м²∙°С/Вт
        /// </summary>
        public double ThermalResistanceRpr { get; set; }
        

        /// <summary>
        /// Значение приведенного сопротивления теплопередаче плоских ограждающих конструкций (или их участков) Rпр, м²∙°С/Вт определяют по формуле (5.6а)
        /// </summary>
        public void ThermalResistanceRprResolve()
        {
            this.ThermalResistanceRpr = Math.Round(COEFFICIENT_r * this.ThermalResistanceR0, 3, MidpointRounding.AwayFromZero);
        }

        /// <summary>
        /// Требуемое приведенное сопротивление теплопередаче, м²∙°С/Вт, следует определять по формуле (5.2)
        /// </summary>
        public double ThermalResistanceRequired { get; set; }

        /// <summary>
        /// Требуемое приведенное сопротивление теплопередаче, м²∙°С/Вт, следует определять по формуле (5.2)
        /// </summary>
        /// <returns>Требуемое приведенное сопротивление теплопередаче, м²∙°С/Вт</returns>
        public void ThermalResistanceRequiredResolve()
        {
            this.ThermalResistanceRequired =
                Math.Round((this.COEFFICIENT_N * (this.TemperatureInsideAir - this.TemperatureOutsideAir)) / (this.HeatTransferInternal * this.TemperatureDifference), 3, MidpointRounding.AwayFromZero);
        }

        /// <summary>
        /// Расчетная температура воздуха tв, °С Таблица 4.1
        /// t в — расчетная температура внутреннего воздуха, °С, принимаемая в соответствии с нормами технологического проектирования; 
        /// </summary>
        public int TemperatureInsideAir { get; set; }

        /// <summary>
        /// Относительная влажность воздуха φв, %
        /// </summary>
        public int HumidityAirInside { get; set; }

        /// <summary>
        /// условия эксплуатации ограждающих конструкций зданий и сооружений в зимний период следует принимать по таблице 4.2 в зависимости от температуры и относительной влажности внутреннего воздуха
        /// </summary>
        public string ServiceConditionsOut { get; set; }

        /// <summary>
        /// Влажностный режим помещений 
        /// </summary>
        public string RegimeRoomOut { get; set; }

        public readonly string[] _serviceConditions = { "A", "Б", "Б", "Б" };
        public readonly string[] _RegimeRoom = { "Сухой", "Нормальный", "Влажный", "Мокрый" };
        private double _thermalResistanceNormative;
        private double _cOEFFICIENT_r = 1.0;
        private double _materialLayerThicknessTemp = 0.12;

        /// <summary>
        /// Влажностный режим помещений { "Сухой", "Нормальный", "Влажный", "Мокрый" };
        /// </summary>
        public string[] RegimeRoom
        {
            get
            {
                return _RegimeRoom;
            }
            private set
            {

            }
        }

        /// <summary>
        /// Влажностный режим помещений и условия эксплуатации ограждающих конструкций зданий и сооружений в зимний период следует принимать по таблице 4.2 в зависимости от температуры и относительной влажности внутреннего воздуха.
        /// </summary>
        public void OperatingConditionsOfEnclosingStructuresResolve()
        {
            if (this.TemperatureInsideAir <= 12)
            {
                if (this.HumidityAirInside <= 60)
                {
                    this.ServiceConditionsOut = _serviceConditions[0];
                    this.RegimeRoomOut = _RegimeRoom[0];
                }
                else if (this.HumidityAirInside > 60 && this.HumidityAirInside <= 75)
                {
                    this.ServiceConditionsOut = _serviceConditions[1];
                    this.RegimeRoomOut = _RegimeRoom[1];
                }
                else if (this.HumidityAirInside > 75)
                {
                    this.ServiceConditionsOut = _serviceConditions[2];
                    this.RegimeRoomOut = _RegimeRoom[2];
                }
            }
            else if (this.TemperatureInsideAir > 12 && this.TemperatureInsideAir <= 24)
            {
                if (this.HumidityAirInside <= 50)
                {
                    this.ServiceConditionsOut = _serviceConditions[0];
                    this.RegimeRoomOut = _RegimeRoom[0];
                }
                else if (this.HumidityAirInside > 50 && this.HumidityAirInside <= 60)
                {
                    this.ServiceConditionsOut = _serviceConditions[1];
                    this.RegimeRoomOut = _RegimeRoom[1];
                }
                else if (this.HumidityAirInside > 60 && this.HumidityAirInside <= 75)
                {
                    this.ServiceConditionsOut = _serviceConditions[2];
                    this.RegimeRoomOut = _RegimeRoom[2];
                }
                else if (this.HumidityAirInside > 75)
                {
                    this.ServiceConditionsOut = _serviceConditions[3];
                    this.RegimeRoomOut = _RegimeRoom[3];
                }
            }
            else if (this.TemperatureInsideAir > 24)
            {
                if (this.HumidityAirInside <= 40)
                {
                    this.ServiceConditionsOut = _serviceConditions[0];
                    this.RegimeRoomOut = _RegimeRoom[0];
                }
                else if (this.HumidityAirInside > 40 && this.HumidityAirInside <= 50)
                {
                    this.ServiceConditionsOut = _serviceConditions[1];
                    this.RegimeRoomOut = _RegimeRoom[1];
                }
                else if (this.HumidityAirInside > 50 && this.HumidityAirInside <= 60)
                {
                    this.ServiceConditionsOut = _serviceConditions[2];
                    this.RegimeRoomOut = _RegimeRoom[2];
                }
                else if (this.HumidityAirInside > 60)
                {
                    this.ServiceConditionsOut = _serviceConditions[3];
                    this.RegimeRoomOut = _RegimeRoom[3];
                }
            }
        }

        public string PrintResult { get; private set; }
        private void PrintResultConsole()
        {
            this.PrintResult =
                 "Rк = " + this.PrintRk() + " = " + this.ThermalResistanceRk + " м²∙°С/Вт" +
                 ", R0 = " + string.Format("1/{0}+", this.HeatTransferInternal) +
                 this.ThermalResistanceRk +
                 string.Format("+1/{0}", this.HeatTransferOuter) + " = " +
                 this.ThermalResistanceR0.ToString() + " м²∙°С/Вт" +
                 ", Rпр = " + this.COEFFICIENT_r + " ∙ " + this.ThermalResistanceR0 + " = " + this.ThermalResistanceRpr.ToString() + " м²∙°С/Вт" +
                 ", Rт.норм = " + this.ThermalResistanceNormative.ToString() + " м²∙°С/Вт" +
                 ", δобщ = " + this.ConstructThickness + ", м" +
                 ", Rт.тр = " + this.ThermalResistanceRequired.ToString() + " м²∙°С/Вт" +
                 ", D = " + this.PrintD() + " = " + this.Inertia.ToString() +
                 ", tн=" + this.TemperatureOutsideAir.ToString() + "(" + this.EstimatedPeriodName[this.EstimatedPeriod] + ")" +
                 ", αн = " + this.HeatTransferOuter + ", Вт/(м²∙°С)" +
                 ", αв = " + this.HeatTransferInternal + ", Вт/(м²∙°С)" +
                 ", n = " + this.COEFFICIENT_N +
                 ", режим помещений: " + this.RegimeRoomOut +
                 ", Условия эксплуатации ограждающих конструкций: " + this.ServiceConditionsOut +
                 ", tв=" + this.TemperatureInsideAir + " °С" +
                 ", φв=" + this.HumidityAirInside + " %" +
                 ", ∆tв=" + this.TemperatureDifference + " °С"
                 ;
        }
    }
}
