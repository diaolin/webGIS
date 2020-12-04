//这里就可以引用你要显示的页面了
import first_page from "../components/first_page.vue"
import data_manage from '../components/data_manage.vue'
import data_manage1 from '../components/data_manage1.vue'
import report_query from '../components/report_query.vue'
import data_browser from '../components/data_browser.vue'
import data_analysis from '../components/data_analysis.vue'
import share_service from '../components/share_service.vue'
import user_management from '../components/user_management'
import system_dispose from '../components/system_dispose'
import loginPage from '../components/loginPage.vue'
// import data_analysis from '../components/Map.vue'
import piebarbar from '../components/piebarbar.vue'
import third from '../components/echart.vue'
import login from '../components/login.vue'
import list from '../components/list.vue'
import Map from '../components/Map.vue'
import content from '../components/content.vue'


// import { component } from "vue/types/umd"

//配置路由，path就是你浏览器地址，component就是跟着你要显示的页面，/表示默认地址。
export default [
	{
		path: '/',
		redirect:'/login',
	},
	{
		path:'/login',
		component: login,
		name:'login',
		
	},
	{
		path:'/list',
		component: list,
		name:'list',
		children:[
			{
				path:'/first_page',
				component: first_page,
				name:'first_page'
			},
			{
				path:'/data_manage',
				component: data_manage,
				name:'data_manage'
			},
			{
				path:'/data_manage1',
				component: data_manage1,
				name:'data_manage1'
			},
			{
				path:'/report_query',
				component: report_query,
				name:'report_query',
			},
			{
				path:'/data_browser',
				component: data_browser,
				name:'data_browser'
			},
			{
				path:'/data_analysis',
				component: data_analysis,
				name:'data_analysis'
			},
			{
				path:'/share_service',
				component:share_service,
				name:'share_service'
			},
			{
				path:'/user_management',
				component:user_management,
				name:'user_management'
			},
			{
				path:'/system_dispose',
				component:system_dispose,
				name:'system_dispose'
			},
			{
				path:'/Map',
				component: Map,
				name:'Map'
			},
			{
				path:'/content',
				component: content,
				name:'content'
			},
			{path:"/third",component:third}//绑定手机号
		]
	},
	
]