<?php
/*Plugin Name: WooCommerce GiftProduct
	Plugin URI: https://acespritech.com/services/wordpress-extensions/
	Description: Gift Your Products 
	Author: Acespritech Solutions Pvt. Ltd.
	Author URI: https://acespritech.com/
	Version: 1.1.0
	Domain Path: /languages/
*/

include_once( ABSPATH . 'wp-admin/includes/plugin.php' );
if ( is_plugin_active( 'woocommerce/woocommerce.php' ) ) 
{
    add_action('wp_enqueue_scripts', 'acewcgp_giftProduct_script');
}
else{ 
    deactivate_plugins(plugin_basename(__FILE__));
    add_action( 'admin_notices', 'acewcgp_woocommerce_not_installed' );
}

function acewcgp_woocommerce_not_installed()
{
    ?>
    <div class="error notice">
      <p><?php _e( 'You need to install and activate WooCommerce to use WooCommerce GiftProduct!', 'WooCommerce-GiftProduct' ); ?></p>
    </div>
    <?php
}

function acewcgp_giftProduct_script()
{
	global $post;
  global $wp;
	$current_url = home_url( $wp->request );
   	$goftproduct_url = get_permalink( get_option('woocommerce_myaccount_page_id')).'giftproduct';
   	if($current_url == $goftproduct_url)
   	{
   		wp_enqueue_script('giftProduct_script', plugins_url('/js/giftproduct.js', __FILE__), array('jquery'));
	    wp_enqueue_style('giftProduct_style', plugins_url('/css/giftproduct_style.css', __FILE__));
   	}   
   	wp_enqueue_style('giftProduct_font_style', plugins_url('/css/font-awesome.min.css', __FILE__));
}
add_action('admin_menu' , 'acewcgp_giftProduct');
function acewcgp_giftProduct()
{
	global $wpdb;
    require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
    $table_name = $wpdb->prefix . "woocommerce_gift_product";

    $sql = "CREATE TABLE $table_name (
	        gift_product_id mediumint(9) NOT NULL AUTO_INCREMENT,
	        group_id varchar(25) NOT NULL,
	        product_id varchar(20) NOT NULL,
            qty int NOT NULL,
	        PRIMARY KEY  (gift_product_id)
	        ) $charset_collate;";

    dbDelta($sql);       
    $table_name1 = $wpdb->prefix . "woocommerce_gift_checkout_details";       
    $sql1 = "CREATE TABLE $table_name1 (
             gift_product_id mediumint(9) NOT NULL AUTO_INCREMENT,
             group_id varchar(25) NOT NULL,
             user_id varchar(5) NOT NULL,
             order_id varchar(10) NOT NULL,
             notify TINYINT(1),
             gift_wrap TINYINT(1),
             delivery_add varchar(255),
             postcode varchar(10),
             email varchar(100),
             phone varchar(15),
             PRIMARY KEY  (gift_product_id)
             ) $charset_collate;";

        dbDelta($sql1);        
}
//ajax function call
add_action('wp_ajax_acewcgp_giftproduct_frontend_content', 'acewcgp_giftproduct_frontend_content');
add_action('wp_ajax_nopriv_acewcgp_giftproduct_frontend_content', 'acewcgp_giftproduct_frontend_content');

add_action('wp_ajax_acewcgp_save_checkout_details', 'acewcgp_save_checkout_details');
add_action('wp_ajax_nopriv_acewcgp_save_checkout_details', 'acewcgp_save_checkout_details');

//-------------------------------
function acewcgp_save_checkout_details()
{
    global $wpdb;
    require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
    $table_name = $wpdb->prefix . "woocommerce_gift_checkout_details";
    $table_name2 = $wpdb->prefix . "woocommerce_gift_product";
    $user = wp_get_current_user();
     $user_id = $user->ID;
    $group_list =sanitize_text_field($_POST['group_list']);
    $group_list_data = json_decode(stripslashes($group_list), true);
    // --------------------- Delete Database Group -------------------//
      $result_db_group = $wpdb->get_results("SELECT * FROM $table_name where user_id = '$user_id' AND order_id = ''");
      foreach ($group_list_data as $group_data) 
      {
          $page_group_id[] = $group_data['group_id'];
      }
      foreach ($result_db_group as $db_group) 
      {   
          $db_group_id = $db_group->group_id;
          if(in_array($db_group_id, $page_group_id)){
          }
          else{
              $delete = $wpdb->get_results("DELETE from $table_name WHERE group_id = '$db_group_id'");
              $delete1 = $wpdb->get_results("DELETE from $table_name2 WHERE group_id = '$db_group_id'");
          }
      }     
    // --------------------- Delete Database Group -------------------//
    foreach ($group_list_data as $group_data) 
    {
        $product_data = $group_data['product_list'];       
       	$group_id = $group_data['group_id'];               
        $result = $wpdb->get_results("SELECT * FROM $table_name where group_id = '$group_id'");
        if(count($result) == 0)
        {
        	$group_data['postcode'];
           
            $group_id = $group_data['group_id'];    
               
              $delivery_add = $group_data['delivery_add'];
              $phone = $group_data['phone_no'];
              $email = $group_data['email'];
              $postcode = $group_data['postcode'];
              $notify = $group_data['notify'];
              $gift_wrap = $group_data['gift_wrap'];
              $sql = "INSERT INTO $table_name (group_id,user_id, delivery_add,phone, email,postcode,notify,gift_wrap) VALUES ('$group_id', '$user_id', '$delivery_add','$phone', '$email','$postcode','$notify','$gift_wrap')";
              $wpdb->query($sql);
              $wpdb->print_error();
           
        }
        else{ 
            $wpdb->query($wpdb->prepare("UPDATE $table_name 
                                        SET delivery_add = %s , phone = %s ,email = %s, postcode = %s , notify = %s , gift_wrap = %s
                                        WHERE group_id = %s", $group_data['delivery_add'],$group_data['phone_no'] , $group_data['email'] , $group_data['postcode'],$group_data['notify'],$group_data['gift_wrap'],$group_data['group_id']));
        }
        for($i = 0; $i < count($product_data); $i++)
        {
            $product = $product_data[$i];
            $group_id;
            $id = $product['id'];
            $qty = $product['qty'];
            $table_name2 = $wpdb->prefix . "woocommerce_gift_product";               
            $product_result = $wpdb->get_results("SELECT * FROM $table_name2 where group_id = '$group_id' AND product_id = '$id'");
            if(count($product_result) == 0)
            {
                $insert2 = $wpdb->insert($table_name2, array(
                                        'product_id' => $id,
                                        'qty' => $qty,
                                        'group_id' => $group_id,
                                        ));                    
            }
            else{
                  $wpdb->query($wpdb->prepare("UPDATE $table_name2 
                                                SET qty = %s 
                                                WHERE group_id = %s AND product_id = %s", $qty , $group_id , $id , $name));
                }
            $key_data[] = $product['id'];                          
            
        }
        // --------------------- Delete Database Group Products-------------------//
          $db_group_product = $wpdb->get_results("SELECT * FROM $table_name2 where group_id = '$group_id'");   foreach ($db_group_product as $group_product) 
            {
                $db_product_id = $group_product->product_id;
                if(in_array($db_product_id, $key_data)){
                }
                else{
                      $delete_product = $wpdb->get_results("DELETE from $table_name2 WHERE group_id = '$group_id' AND product_id = '$id'");
                    }
            }                     
        // --------------------- Delete Database Group Products-------------------//       
    }          
die();
}
add_action('woocommerce_email_order_details', 'acewcgp_giftproduct_detilas_admin_order');
function acewcgp_giftproduct_detilas_admin_order( $order ) 
{
    $order_id;    
    $user = wp_get_current_user();
  	$user_id = $user->ID;
    global $wpdb;
    require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
    $order_data = $order->get_data();
    $order_id = $order_data['id'];
    $table_name = $wpdb->prefix . "woocommerce_gift_checkout_details";
   	$wpdb->query($wpdb->prepare("UPDATE $table_name 
                                SET order_id = %s 
                                WHERE user_id = %s AND order_id = ''", $order_id , $user_id));  
    
    $table_name2 = $wpdb->prefix . "woocommerce_gift_product";        
    $group_data = $wpdb->get_results("SELECT * FROM $table_name where order_id = '$order_id'");
    if(!empty($group_data))
    {
        $message = '<div style="text-align: left;"><div class="left" style="width:50%; float:left;"><h1>Gift From '.$user->display_name.'</h1><div class="details"><p>Congratulations!</p><p>You are on your way to doing some great things indeed.</p><p>Gift From '.$user->display_name.'</p></div></div><div class="right" style="width:50%; float:left; text-align: center;"><img src="'.esc_url( plugins_url( 'images/gift_banner.png', __FILE__ ) ).'"></img></div><div class="header" style="width: 95%; float: left; padding: 5px; border: 1px solid gray;"><div style="width: 50%; float: left; font-weight: bold;">Products</div><div style="width: 50%; float: left; font-weight: bold; text-align: left;">Delivery Address</div></div>';          
        foreach($group_data as $group) 
        {
           $group->email;
           if($group->notify == 1)
           {
           		$message2 = '';
		          $message2 .='<div class="row" style="width: 95%; float: left; border-bottom: 1px solid gray; padding: 5px;"><div style="width: 50%; float: left;">';
		              
		        $product_data = $wpdb->get_results("SELECT * FROM $table_name2 where group_id = '$group->group_id'");
		                foreach ($product_data as $product)
		                        {
		                        	$product->product_id;
		                        	$product_id = explode('_', $product->product_id);
		                        	if($product_id[1] == 0){
		                        		$product_id = $product_id[0];
		                        	}
		                        	else{
		                        		$product_id = $product_id[1];
		                        	}
		                          $product_info = wc_get_product( $product_id );
		                          $product_data = $product_info->get_data();
		        $message2 .= '<div class ="product-row" style="width: 100%; float: left;">
		                      <div class="thumb" style="float: left; width: 50%;">
		                  		<img src="'.get_the_post_thumbnail_url($product_info->get_id(), 'full').'"style="margin:10px 0px;" width="100" height="100" class="prod_img" />
		                      </div>
		                       <div class="thumb" style="float: left; width: 50%; text-align: left;">
			                      <h5 style="margin: 5px;">'.$product_data['name'].'</h5>
			                      <span>Qty '.$product->qty.'</span>
			                    </div>
		                      </div>';
		                        } 
		        $message2 .='</div><div class="address_details" style="width: 50%; float: left; text-align: left;">';
		        $message2 .= $group->delivery_add.'</br>'.$group->postcode.'<p><b> Email: </b>'.$group->email.'</p><p><b>Phone: </p>'.$group->phone.'</div></div></div>';
		        $message2 .='</div></div></div>';
		        $mail_message = $message.$message2;
		        $headers = array('Content-Type: text/html; charset=UTF-8');   
           		wp_mail($group->email, 'Gift Product', $mail_message, $headers, '');
           }          
           
      	}   
  }
  return $order_id;
}
add_action('woocommerce_cart_calculate_fees', 'acewcgp_apply_gift_wrap_fee');
function acewcgp_apply_gift_wrap_fee()
{
     global $wpdb;
     global $woocommerce;
     require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
     $table_name = $wpdb->prefix . "woocommerce_gift_checkout_details";
     $table_name2 = $wpdb->prefix . "woocommerce_gift_product";
     $user = wp_get_current_user();
     $user_id = $user->ID;
     $group_data = $wpdb->get_results("SELECT * FROM $table_name where user_id = '$user_id' AND order_id = ''");
     //var_dump($group_data);
    if(!empty($group_data))
    {
        $add_fee = 0;
       foreach($group_data as $group) 
        {
           if($group->gift_wrap == 1)
           {
              $product_data = $wpdb->get_results("SELECT * FROM $table_name2 where group_id = '$group->group_id'");
              foreach ($product_data as $product)
              {
                $product->qty;
                 $add_fee = $add_fee + get_option('giftproduct_charge', 1) * $product->qty;
              }
           }
        }
    }
    if($add_fee != 0){
     WC()->cart->add_fee('Gift Wrap Charges', $add_fee);
    }

}
add_action('woocommerce_cart_calculate_fees', 'acewcgp_wpi_add_ship_fee');

function acewcgp_wpi_add_ship_fee() {
   global $wpdb;
   global $woocommerce;
   require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
   $table_name = $wpdb->prefix . "woocommerce_gift_checkout_details";
   $table_name2 = $wpdb->prefix . "woocommerce_shipping_zone_locations";
   $user = wp_get_current_user();
   $user_id = $user->ID;
   $customer = new WC_Customer();
   $customer_shipping_postcode =  $woocommerce->customer->get_shipping_postcode();
   $extra_price = 0.00;
   $result_db_group = $wpdb->get_results("SELECT * FROM $table_name where user_id = '$user_id' AND order_id = ''");
   foreach ($result_db_group as $db_group) 
   {   
       $db_post_code = $db_group->postcode;
       $result_db_rate = $wpdb->get_results("SELECT zone_id FROM $table_name2 where location_type = 'postcode' AND location_code = '$db_post_code' ");
       $db_post_code_rate = $result_db_rate[0]->zone_id;
       $result_db_rate = $wpdb->get_results("SELECT zone_id FROM $table_name2 where location_type = 'postcode' AND location_code = '$db_post_code' ");
       $db_post_code_rate = $result_db_rate[0]->zone_id;

       $delivery_zones = WC_Shipping_Zones::get_zones();
       foreach ((array) $delivery_zones as $key => $the_zone ) {
           if($db_post_code_rate == $the_zone['zone_id']){
               if($customer_shipping_postcode != $db_post_code_rate){
                   foreach ($the_zone['shipping_methods'] as $value) {
                   if($value->id == "flat_rate"){
                        $extra_price = floatval($extra_price) + floatval($value->cost);
                   }                  
               }
               }               
           }         
       }
   }   
   if($extra_price > 0.00){
       WC()->cart->add_fee('Gift Shipping Charges', $extra_price);
   }
     
}
add_action( 'woocommerce_admin_order_totals_after_refunded','acewcgp_gift_product_admin_order_details', $order->id );
function acewcgp_gift_product_admin_order_details() {
	global $wpdb;
    require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
    $order_id = sanitize_text_field($_GET['post']);
    $table_name = $wpdb->prefix . "woocommerce_gift_checkout_details";
    $table_name2 = $wpdb->prefix . "woocommerce_gift_product";        
    $group_data = $wpdb->get_results("SELECT * FROM $table_name where order_id = '$order_id'");
    if(!empty($group_data)){
    ?>
    <div style="text-align: center;">
        <h1>Gift Product Details</h1>
        <div class="header" style="width: 100%; float: left; padding: 5px; border: 1px solid gray;">        
            <div style="width: 25%; float: left; font-weight: bold;">Group ID</div>
            <div style="width: 30%; float: left; font-weight: bold;">Products</div>    
            <div style="width: 30%; float: left; font-weight: bold;">Delivery Address</div>
            <div style="width: 10%; float: left; font-weight: bold;">Gift Wrap</div>   
        </div>
       	<?php         
        	foreach ($group_data as $group) {       
        ?>
        <div class="row" style="width: 100%; float: left; border-bottom: 1px solid gray; padding: 5px;">
            <div class="group-name" style="width: 25%; float: left;"><?php echo $group->group_id; ?></div>            
            <div style="width: 30%; float: left;">
                <?php 
                    $product_data = $wpdb->get_results("SELECT * FROM $table_name2 where group_id = '$group->group_id'");
                  
                    foreach ($product_data as $product) 
                    {
                    	$product->product_id;
		                        	$product_id = explode('_', $product->product_id);
		                        	if($product_id[1] == 0){
		                        		$product_id = $product_id[0];
		                        	}
		                        	else{
		                        		$product_id = $product_id[1];
		                        	}
                        $product_info = wc_get_product( $product_id );
		                $product_data = $product_info->get_data();                  
                ?>
                <div class ="product-row" style="width: 100%;">
                    <div class="thumb" style="float: left;">
                        <img src="<?php echo get_the_post_thumbnail_url($product_info->get_id(), 'full') ?>" width="50" height="50" class="prod_img" />
                    </div>
                    <h5 style="margin: 5px;"><?php echo $product_data['name']; ?></h5>
                    <span><?php echo 'Qty '.$product->qty; ?></span>
                </div>
                <?php } ?>
            </div>            
            <div class="address_details" style="width: 30%; float: left; text-align: left;"><?php echo $group->delivery_add.'</br>'.$group->postcode.'</br><b> Email: </b>'.$group->email.'</br><b> Phone: </b>'.$group->phone; ?> </div>
            <div style="width: 10%; float: left; font-weight: bold;"><?php if($group->gift_wrap == 1){ echo 'Yes'; } else{
              echo 'No'; } ?></div>
        </div>
         <?php } ?>         
    </div>
    <?php
}
}

add_action( 'woocommerce_proceed_to_checkout' , 'acewcgp_woocommerce_button_gifproduct' ); 
function acewcgp_woocommerce_button_gifproduct() 
{   
  	?>
    	<a style="margin-bottom: 20px;" href="<?php echo get_permalink( get_option('woocommerce_myaccount_page_id')); ?>/giftproduct" class="checkout-button button alt wc-forward">Proceed to Gift Product</a>
   	<?php
  
}

function acewcgp_giftproduct_plugin_path() {
  return untrailingslashit( plugin_dir_path( __FILE__ ) );
}

add_filter( 'woocommerce_locate_template', 'acewcgp_giftproduct_woocommerce_locate_template', 10, 3 );

function acewcgp_giftproduct_woocommerce_locate_template( $template, $template_name, $template_path ) 
{
  global $woocommerce;
  $_template = $template;
  if ( ! $template_path ) $template_path = $woocommerce->template_url;
  $plugin_path  = acewcgp_giftproduct_plugin_path() . '/woocommerce/';
  $template = locate_template(array($template_path . $template_name,$template_name));
  if ( ! $template && file_exists( $plugin_path . $template_name ) )
    $template = $plugin_path . $template_name;

  if ( ! $template )
    $template = $_template;
    $template;
  return $template;
}

add_action('init', 'acewcgp_giftproduct_endpoint');
function acewcgp_giftproduct_endpoint()
{
    add_rewrite_endpoint('giftproduct', EP_PAGES);
}

add_filter( 'page_template', 'acewcgp_giftlist_page_template' );
function acewcgp_giftlist_page_template( $page_template )
{
    global $wp_query;
    if(isset($wp_query->query['giftproduct'])){         
        $page_template = dirname( __FILE__ ).'/template/default.php' ;
    }
    return $page_template;
}

add_action('woocommerce_account_giftproduct_endpoint', 'acewcgp_giftproduct_frontend_content');
function acewcgp_giftproduct_frontend_content()
{
}

add_filter('the_title', 'acewcgp_giftproduct_endpoint_title');
function acewcgp_giftproduct_endpoint_title($title)
{
    global $wp_query;
    $is_endpoint = isset($wp_query->query_vars['giftproduct']);
    if ($is_endpoint && !is_admin() && is_main_query() && in_the_loop() && is_account_page()) {
        $title = __('Gift Product', 'woocommerce');
        remove_filter('the_title', 'acewcgp_giftproduct_endpoint_title');
    }
    return $title;
}

add_filter( 'woocommerce_get_settings_products', 'acewcgp_wcslider_all_settings', 10, 2 );
function acewcgp_wcslider_all_settings( $settings) {
 
  $updated_settings = array();
    foreach ($settings as $section) {      
      if (isset($section['id']) && 'woocommerce_review_rating_required' == $section['id']) {
        $updated_settings[] = array(
                'name' => __('Gift Wrap Charges', 'Gift Wrap Charges'),
                'id' => 'giftproduct_charge',
                'type' => 'text',
                'css' => 'min-width:300px;',
                'desc' => __(''),
            );
      }
      $updated_settings[] = $section;
    }
  return $updated_settings;
}

add_action('wp_ajax_acewcgp_remove_single_product', 'acewcgp_remove_single_product');
add_action('wp_ajax_nopriv_acewcgp_remove_single_product', 'acewcgp_remove_single_product');
function acewcgp_remove_single_product()
{
  echo $product_id = sanitize_text_field($_POST['product_id']);
  echo $group_id = sanitize_text_field($_POST['group_id']);
  global $wpdb;
  require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
  $table_name1 = $wpdb->prefix . "woocommerce_gift_product";
  $delete = $wpdb->get_results("DELETE FROM $table_name1 where group_id = '$group_id'  AND product_id = '$product_id'");
  $table_name = $wpdb->prefix . "woocommerce_gift_checkout_details";
}
add_action( 'woocommerce_update_cart_action_cart_updated', 'acewcgp_on_action_cart_updated', 20, 1 );
function acewcgp_on_action_cart_updated( $cart_updated )
{
    global $wpdb;
    require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
    $table_name = $wpdb->prefix . "woocommerce_gift_checkout_details";
    $table_name2 = $wpdb->prefix . "woocommerce_gift_product";
    $user = wp_get_current_user();
    $user_id = $user->ID;
  
    $result_db_group = $wpdb->get_results("SELECT * FROM $table_name where user_id = '$user_id' AND order_id = ''");
      
    foreach ($result_db_group as $db_group) 
    {          
        $db_group_id = $db_group->group_id;
        $delete = $wpdb->get_results("DELETE from $table_name WHERE group_id = '$db_group_id'");
        $delete1 = $wpdb->get_results("DELETE from $table_name2 WHERE group_id = '$db_group_id'");
    }
}
